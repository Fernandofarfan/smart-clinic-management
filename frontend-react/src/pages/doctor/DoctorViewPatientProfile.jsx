import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, ArrowLeft } from 'lucide-react';
import api from '../../services/api';

const DoctorViewPatientProfile = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await api.get(`/patients/${patientId}`);
                setPatient(response.data);
            } catch (error) {
                console.error("Failed to fetch patient profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [patientId]);

    if (loading) return <div>Loading profile...</div>;
    if (!patient) return <div>Patient not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/patients')}
                className="flex items-center text-surface-500 hover:text-primary-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Patients
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-32"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="p-1.5 bg-white rounded-full">
                            <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center text-4xl font-bold text-surface-400 border-4 border-white shadow-sm">
                                {patient.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="mb-2">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${patient.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                {patient.isActive ? 'Active Patient' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-surface-900">{patient.name}</h1>
                            <p className="text-surface-500">Patient ID: #{patient.id}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-surface-900 uppercase tracking-wider">Contact Information</h3>

                                <div className="flex items-center space-x-3 text-surface-600">
                                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <span>{patient.email}</span>
                                </div>

                                <div className="flex items-center space-x-3 text-surface-600">
                                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <span>{patient.phone || 'No phone number provided'}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-surface-900 uppercase tracking-wider">Account Details</h3>

                                <div className="flex items-center space-x-3 text-surface-600">
                                    <div className="p-2 bg-secondary-50 text-secondary-600 rounded-lg">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <span>Role: Patient</span>
                                </div>

                                <div className="flex items-center space-x-3 text-surface-600">
                                    <div className="p-2 bg-secondary-50 text-secondary-600 rounded-lg">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <span>Member since: {new Date().getFullYear()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorViewPatientProfile;
