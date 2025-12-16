import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';
import DoctorDashboard from './doctor/DoctorDashboard';
import PatientDashboard from './patient/PatientDashboard';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <LayoutDashboard className="h-8 w-8 text-indigo-600" />
                                <span className="ml-2 text-xl font-bold text-gray-800">Smart Clinic</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">Welcome, {user?.name || user?.email}</span>
                            <button
                                onClick={logout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
                            >
                                <LogOut className="h-5 w-5 mr-1" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {user?.role === 'admin' && <AdminDashboard />}
                    {user?.role === 'doctor' && <DoctorDashboard />}
                    {user?.role === 'patient' && <PatientDashboard />}
                    {/* Fallback if no specific role or unknown */}
                    {!['admin', 'doctor', 'patient'].includes(user?.role) && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Welcome! Please select a role to view dashboard.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
