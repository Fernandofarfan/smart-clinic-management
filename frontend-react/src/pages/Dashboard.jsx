import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminDashboard from './admin/AdminDashboard';
import DoctorDashboard from './doctor/DoctorDashboard';
import PatientDashboard from './patient/PatientDashboard';

export default function Dashboard() {
    const { user } = useAuth();
    const role = user?.role;

    return (
        <DashboardLayout role={role}>
            {role === 'admin' && <AdminDashboard />}
            {role === 'doctor' && <DoctorDashboard />}
            {role === 'patient' && <PatientDashboard />}

            {!['admin', 'doctor', 'patient'].includes(role) && (
                <div className="text-center py-20">
                    <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-surface-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-surface-900 dark:text-white">Welcome to Smart Clinic</h2>
                        <p className="text-surface-500 dark:text-gray-400 mt-2">Please contact support to assign a role to your account.</p>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
