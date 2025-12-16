import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, User } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import AddPatientModal from '../../components/modals/AddPatientModal';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            // In a real app, this should filter by the logged-in doctor.
            // For now, fetching all patients.
            const response = await api.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error("Failed to fetch patients", error);
        }
    };

    const handleViewRecords = (patientId) => {
        navigate(`/doctor/patients/${patientId}/records`);
    };

    const handleViewProfile = (patientId) => {
        navigate(`/doctor/patients/${patientId}/profile`);
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-surface-900">My Patients</h2>
                    <p className="text-surface-500">Patient records and history</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                        + Add Patient
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-surface-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none"
                    />
                </div>
                <button className="px-4 py-2 border border-surface-200 rounded-xl bg-white text-surface-600 hover:bg-surface-50 flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface-50 border-b border-surface-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Last Visit</th>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {filteredPatients.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-surface-500">
                                    No patients found.
                                </td>
                            </tr>
                        ) : (
                            filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-surface-900">{patient.name}</p>
                                                <p className="text-xs text-surface-500">ID: {patient.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-surface-600">
                                        <div>{patient.email}</div>
                                        <div className="text-xs text-surface-400">{patient.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-surface-600">
                                        {/* Mock data for now as Patient entity doesn't track last visit directly */}
                                        2024-03-15
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${patient.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {patient.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleViewRecords(patient.id)}
                                                className="p-2 hover:bg-primary-50 rounded-lg text-surface-400 hover:text-primary-600 transition-colors"
                                                title="View Medical Records"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleViewProfile(patient.id)}
                                                className="p-2 hover:bg-surface-100 rounded-lg text-surface-400 hover:text-surface-600 transition-colors"
                                                title="View Profile"
                                            >
                                                <User className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onPatientAdded={fetchPatients}
            />
        </div>
    );
};

export default DoctorPatients;
