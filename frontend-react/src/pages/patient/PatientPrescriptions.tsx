import React, { useState, useEffect } from 'react';
import { FileText, Download, Pill, Calendar } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PatientPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user || !user.id) return;
            try {
                const response = await api.get(`/prescriptions/patient/${user.id}`);
                
                // Group prescriptions by appointment ID (or date if appointment is null)
                const grouped = {};
                response.data.forEach(p => {
                    // Use appointment ID as key if available, otherwise use prescription ID (fallback)
                    // Note: If multiple prescriptions have same appointment ID, they belong to same visit
                    const key = p.appointment ? p.appointment.id : `p-${p.id}`;
                    
                    if (!grouped[key]) {
                        grouped[key] = {
                            id: key,
                            doctorName: p.doctor ? p.doctor.name : 'Doctor',
                            date: p.prescriptionDate,
                            medications: [],
                            status: p.status
                        };
                    }
                    
                    grouped[key].medications.push({
                        name: p.medication,
                        dosage: p.dosage,
                        frequency: p.instructions, // Using instructions as frequency/details
                        duration: '' 
                    });
                });

                setPrescriptions(Object.values(grouped));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching prescriptions", error);
                setLoading(false);
            }
        };
        
        if (user) {
            fetchPrescriptions();
        }
    }, [user]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-surface-900">Mis Recetas</h2>
                    <p className="text-surface-500">Historial de medicamentos recetados</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <p>Cargando recetas...</p>
                ) : prescriptions.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-surface-200">
                        <Pill className="w-12 h-12 text-surface-300 mx-auto mb-4" />
                        <p className="text-surface-500">No tienes recetas registradas.</p>
                    </div>
                ) : (
                    prescriptions.map((prescription) => (
                        <div key={prescription.id} className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                            <div className="p-6 border-b border-surface-100 flex justify-between items-start">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-surface-900">Receta #{prescription.id}</h3>
                                        <div className="flex items-center space-x-4 mt-1 text-sm text-surface-500">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(prescription.date).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <span>{prescription.doctorName}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 text-surface-400 hover:text-primary-600 transition-colors" title="Descargar PDF">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-6 bg-surface-50/50">
                                <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">Medicamentos</h4>
                                <div className="space-y-3">
                                    {prescription.medications.map((med, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-surface-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                                <span className="font-medium text-surface-900">{med.name} <span className="text-surface-500 font-normal">{med.dosage}</span></span>
                                            </div>
                                            <div className="text-sm text-surface-600">
                                                {med.frequency} por {med.duration}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PatientPrescriptions;
