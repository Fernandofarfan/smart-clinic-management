import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/StatsCard';
import { Calendar, Star, Clock, FileText } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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

                    // Fetch Today's Appointments - Use local date instead of UTC
                    const date = new Date();
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const today = `${year}-${month}-${day}`;
                    
                    const apptResponse = await api.get(`/appointments/doctor/${user.id}?date=${today}`);
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
    }, [user]);

    return (
        <div className="space-y-6">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Appointments</h3>
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <p className="text-gray-500 text-sm">No appointments scheduled for today.</p>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{apt.patient?.firstName} {apt.patient?.lastName}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View</button>
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
                                    <p className="text-xs text-green-600 mt-2">- {review.patient?.firstName || "Anonymous"}</p>
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
