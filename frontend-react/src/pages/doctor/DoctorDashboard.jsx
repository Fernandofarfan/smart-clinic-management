import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/StatsCard';
import { Calendar, Star, Clock, FileText } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { connectWebSocket, disconnectWebSocket } from '../../services/WebSocketService';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        appointmentsToday: 0,
        pendingReviews: 0,
        avgRating: 0.0,
        hoursLogged: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user && user.id) {
                try {
                    // Fetch Stats
                    const statsResponse = await api.get(`/analytics/doctor/${user.id}/performance`);
                    setStats(statsResponse.data);

                    // Fetch All Appointments
                    const apptResponse = await api.get(`/appointments/doctor/${user.id}`);
                    setAppointments(apptResponse.data);

                    // Fetch Recent Reviews
                    const reviewsResponse = await api.get(`/reviews/doctor/${user.id}`);
                    setReviews(reviewsResponse.data);

                } catch (error) {
                    console.error("Error fetching doctor dashboard data", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();

        // Connect WebSocket
        connectWebSocket((message) => {
            alert("🔔 New Notification: " + message);
            // Optionally refresh data here
            fetchData();
        });

        return () => disconnectWebSocket();
    }, [user]);

    const [viewModal, setViewModal] = useState({ show: false, appointment: null });

    const handleViewClick = (appt) => {
        setViewModal({ show: true, appointment: appt });
    };

    return (
        <div className="space-y-6">
            {/* View Details Modal */}
            {viewModal.show && viewModal.appointment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                            <button
                                onClick={() => setViewModal({ show: false, appointment: null })}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</h4>
                                <p className="text-sm font-medium text-gray-900">{viewModal.appointment.patient?.name || 'Unknown'}</p>
                                <p className="text-sm text-gray-500">{viewModal.appointment.patient?.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</h4>
                                    <p className="text-sm text-gray-900">{new Date(viewModal.appointment.appointmentTime).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</h4>
                                    <p className="text-sm text-gray-900">{new Date(viewModal.appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</h4>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${viewModal.appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    viewModal.appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                    {viewModal.appointment.status}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Symptoms</h4>
                                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                                    {viewModal.appointment.symptoms || "No symptoms listed."}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</h4>
                                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                                    {viewModal.appointment.notes || "No notes."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setViewModal({ show: false, appointment: null })}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h2>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Appointments Today" value={loading ? "..." : stats.appointmentsToday} icon={Calendar} color="#4F46E5" />
                <StatsCard title="Pending Reviews" value={loading ? "..." : stats.pendingReviews} icon={Star} color="#F59E0B" />
                <StatsCard title="Avg. Rating" value={loading ? "..." : (stats.avgRating ? stats.avgRating.toFixed(1) : "0.0")} icon={Star} color="#10B981" />
                <StatsCard title="Hours Logged" value={loading ? "..." : stats.hoursLogged} icon={Clock} color="#6B7280" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">All Appointments</h3>
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <p className="text-gray-500 text-sm">No appointments found.</p>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{apt.patient?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(apt.appointmentTime).toLocaleDateString()} - {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {apt.reason && ` - ${apt.reason}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                            apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {apt.status}
                                        </span>
                                        <button
                                            onClick={() => handleViewClick(apt)}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h3>
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500 text-sm">No reviews yet.</p>
                        ) : (
                            reviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="p-4 bg-green-50 border border-green-100 rounded-lg">
                                    <p className="text-sm text-green-800 italic">"{review.comment}"</p>
                                    <p className="text-xs text-green-600 mt-2">- {review.patient?.name || "Anonymous"}</p>
                                    <div className="mt-1 flex text-yellow-500 text-xs">
                                        {"★".repeat(review.rating)}
                                        {"☆".repeat(5 - review.rating)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
