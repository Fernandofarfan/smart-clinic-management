import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard';
import AddDoctorModal from '../../components/AddDoctorModal';
import { Users, UserPlus, DollarSign, Activity } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/analytics/admin/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);



    const handleAction = (action) => {
        if (action === 'Add New Doctor') {
            setShowAddDoctor(true);
        } else if (action === 'View Audit Logs') {
            navigate('/admin/audit-logs');
        } else if (action === 'Manage Payments') {
            navigate('/admin/payments');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Overview</h2>

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Doctors" value={loading ? "..." : stats.totalDoctors} icon={UserPlus} color="#4F46E5" />
                <StatsCard title="Total Patients" value={loading ? "..." : stats.totalPatients} icon={Users} color="#10B981" />
                <StatsCard title="Total Revenue" value={loading ? "..." : `$${stats.totalRevenue || 0}`} icon={DollarSign} color="#F59E0B" />
                <StatsCard title="Total Appointments" value={loading ? "..." : stats.totalAppointments} icon={Activity} color="#EF4444" />
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => handleAction('Add New Doctor')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                        <span className="block font-semibold text-indigo-600">Add New Doctor</span>
                        <span className="text-sm text-gray-500">Create a new doctor account</span>
                    </button>
                    <button
                        onClick={() => handleAction('View Audit Logs')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                        <span className="block font-semibold text-indigo-600">View Audit Logs</span>
                        <span className="text-sm text-gray-500">Check system security logs</span>
                    </button>
                    <button
                        onClick={() => handleAction('Manage Payments')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                        <span className="block font-semibold text-indigo-600">Manage Payments</span>
                        <span className="text-sm text-gray-500">Review recent transactions</span>
                    </button>
                </div>
            </div>


            {
                showAddDoctor && (
                    <AddDoctorModal
                        onClose={() => setShowAddDoctor(false)}
                        onDoctorAdded={() => {
                            // Refresh stats if needed
                            window.location.reload();
                        }}
                    />
                )
            }
        </div >
    );
};

export default AdminDashboard;
