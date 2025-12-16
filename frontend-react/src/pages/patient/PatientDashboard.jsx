import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import { Calendar, FileText, Activity, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        nextAppointmentDays: -1,
        activePrescriptions: 0,
        medicalRecords: 0,
        newNotifications: 0
    });
    const [apiError, setApiError] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (user && user.id) {
                try {
                    // Fetch Stats
                    try {
                        const response = await api.get(`/analytics/patient/${user.id}/health`);
                        setStats(response.data);
                    } catch (e) {
                        console.warn("Stats fetch failed", e);
                    }

                    // Fetch Appointments
                    const apptResponse = await api.get(`/appointments/patient/${user.id}`);
                    setAppointments(apptResponse.data);

                } catch (error) {
                    console.error("Error fetching dashboard data", error);
                    setApiError("Failed to load dashboard data. Please try again.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStats();
    }, [user]);

    const getNextAppointmentText = () => {
        if (stats.nextAppointmentDays === -1) return "No upcoming";
        if (stats.nextAppointmentDays === 0) return "Today";
        if (stats.nextAppointmentDays === 1) return "Tomorrow";
        return `In ${stats.nextAppointmentDays} days`;
    };

    const [rescheduleModal, setRescheduleModal] = useState({ show: false, appointmentId: null, currentDatetoISO: '' });
    const [newDate, setNewDate] = useState('');

    const handleRescheduleClick = (appt) => {
        setRescheduleModal({
            show: true,
            appointmentId: appt.id,
            currentDatetoISO: appt.appointmentTime
        });
        // Pre-fill with existing time or empty
        setNewDate(appt.appointmentTime ? appt.appointmentTime.substring(0, 16) : '');
    };

    const confirmReschedule = async () => {
        if (!newDate) return;
        try {
            setLoading(true); // Show loading feedback
            // Calling the new endpoint: PUT /appointments/{id}/reschedule?newTime=...
            // Note: HTML datetime-local uses 'T' separator, which matches ISO.
            await api.put(`/appointments/${rescheduleModal.appointmentId}/reschedule?newTime=${newDate}:00`);

            // Refresh list
            const apptResponse = await api.get(`/appointments/patient/${user.id}`);
            setAppointments(apptResponse.data);

            setRescheduleModal({ show: false, appointmentId: null, currentDatetoISO: '' });
            alert("Appointment rescheduled successfully!");
        } catch (error) {
            console.error("Reschedule failed", error);
            alert("Failed to reschedule: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const [cancelModal, setCancelModal] = useState({ show: false, appointmentId: null });
    const [cancelReason, setCancelReason] = useState('');

    const handleCancelClick = (appt) => {
        setCancelModal({ show: true, appointmentId: appt.id });
        setCancelReason('');
    };

    const confirmCancel = async () => {
        try {
            setLoading(true);
            await api.put(`/appointments/${cancelModal.appointmentId}/cancel?reason=${encodeURIComponent(cancelReason)}`);

            // Refresh list
            const apptResponse = await api.get(`/appointments/patient/${user.id}`);
            setAppointments(apptResponse.data);

            setCancelModal({ show: false, appointmentId: null });
            alert("Appointment cancelled successfully!");
        } catch (error) {
            console.error("Cancel failed", error);
            alert("Failed to cancel: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const [uploadModal, setUploadModal] = useState({ show: false, file: null });
    const [documents, setDocuments] = useState([]);

    const handleUploadClick = async () => {
        setUploadModal({ show: true, file: null });
        // Fetch existing docs
        try {
            const res = await api.get(`/documents/patient/${user.id}`);
            setDocuments(res.data);
        } catch (e) {
            console.error("Failed to fetch docs", e);
        }
    };

    const handleFileChange = (e) => {
        setUploadModal({ ...uploadModal, file: e.target.files[0] });
    };

    const confirmUpload = async () => {
        if (!uploadModal.file) return;
        const formData = new FormData();
        formData.append('file', uploadModal.file);
        formData.append('patientId', user.id);

        try {
            setLoading(true);
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Document uploaded successfully!");
            setUploadModal({ show: false, file: null });
        } catch (e) {
            console.error(e);
            alert("Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Modal */}
            {uploadModal.show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">Upload Document</h3>
                        <div className="mb-4">
                            <input type="file" onChange={handleFileChange} className="mb-2 w-full" />
                            <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG</p>
                        </div>

                        <div className="max-h-40 overflow-y-auto mb-4 border-t pt-2">
                            <h4 className="text-sm font-semibold mb-2">My Documents</h4>
                            {documents.length === 0 ? <p className="text-xs text-gray-400">No documents yet.</p> : (
                                <ul className="text-sm space-y-1">
                                    {documents.map(doc => (
                                        <li key={doc.id} className="flex justify-between">
                                            <span className="truncate w-32">{doc.originalName}</span>
                                            <span className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setUploadModal({ show: false, file: null })} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                            <button onClick={confirmUpload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Upload</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal.show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4 text-red-600">Cancel Appointment</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Reason (Optional)</label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="E.g., Formatting conflict..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setCancelModal({ show: false, appointmentId: null })}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Back
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancel Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleModal.show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">Reschedule Appointment</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">New Date & Time</label>
                            <input
                                type="datetime-local"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setRescheduleModal({ show: false, appointmentId: null })}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReschedule}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {apiError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> {apiError}</span>
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800">My Health Dashboard</h2>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Next Appointment" value={loading ? "..." : getNextAppointmentText()} icon={Calendar} color="#4F46E5" />
                <StatsCard title="Prescriptions" value={loading ? "..." : `${stats.activePrescriptions} Active`} icon={FileText} color="#10B981" />
                <StatsCard title="Medical Records" value={loading ? "..." : `${stats.medicalRecords} Files`} icon={Activity} color="#F59E0B" />
                <StatsCard title="Notifications" value={loading ? "..." : `${stats.newNotifications} New`} icon={AlertCircle} color="#EF4444" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Appointments Table */}
                <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">My Appointments</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No appointments found.
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((apt) => (
                                        <tr key={apt.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                Dr. {apt.doctor?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(apt.appointmentTime).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${apt.status === 'CONFIRMED' || apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {apt.status || 'SCHEDULED'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleRescheduleClick(apt)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Reschedule
                                                </button>
                                                <button
                                                    onClick={() => handleCancelClick(apt)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Cancel
                                                </button>
                                                {apt.status === 'COMPLETED' && (
                                                    <button
                                                        onClick={() => {
                                                            const token = user.token || localStorage.getItem('token');
                                                            // We need to fetch with auth header, creating a blob
                                                            fetch(`${api.defaults.baseURL}/appointments/${apt.id}/pdf`, {
                                                                headers: { 'Authorization': `Bearer ${token}` }
                                                            })
                                                                .then(res => res.blob())
                                                                .then(blob => {
                                                                    const url = window.URL.createObjectURL(blob);
                                                                    const a = document.createElement('a');
                                                                    a.href = url;
                                                                    a.download = `appointment_${apt.id}.pdf`;
                                                                    a.click();
                                                                })
                                                                .catch(e => alert("Error downloading PDF"));
                                                        }}
                                                        className="text-green-600 hover:text-green-900 ml-4"
                                                    >
                                                        ⬇ PDF
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/book-appointment')}
                            className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Book New Appointment
                        </button>
                        <button
                            onClick={handleUploadClick}
                            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Upload Document
                        </button>
                        <button
                            onClick={() => {
                                const history = appointments.filter(a => new Date(a.appointmentTime) < new Date());
                                if (history.length === 0) alert("No past appointment history found.");
                                else {
                                    setAppointments(history);
                                    alert(`Showing ${history.length} past appointments.`);
                                }
                            }}
                            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            View History
                        </button>
                        <button
                            onClick={async () => {
                                setLoading(true); // Show loading
                                try {
                                    const apptResponse = await api.get(`/appointments/patient/${user.id}`);
                                    setAppointments(apptResponse.data);
                                    alert("Showing all appointments.");
                                } catch (error) {
                                    console.error("Failed to fetch all appointments", error);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 mt-2"
                        >
                            View All Appointments
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 mt-2"
                        >
                            My Profile / Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
