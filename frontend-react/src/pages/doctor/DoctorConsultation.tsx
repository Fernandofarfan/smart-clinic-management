import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, FileText, Plus, Trash, CheckCircle, User, Calendar } from 'lucide-react';
import api from '../../services/api';

const DoctorConsultation = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    
    // Consultation Data
    const [notes, setNotes] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });
    
    const [diagnosis, setDiagnosis] = useState('');
    
    // Prescription Data
    const [prescriptions, setPrescriptions] = useState([]);
    const [newPrescription, setNewPrescription] = useState({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await api.get(`/appointments/${appointmentId}`);
                setAppointment(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching appointment", error);
                setLoading(false);
            }
        };
        if (appointmentId) {
            fetchAppointment();
        }
    }, [appointmentId]);

    const handleNoteChange = (e) => {
        setNotes({ ...notes, [e.target.name]: e.target.value });
    };

    const handleAddPrescription = () => {
        if (!newPrescription.medication || !newPrescription.dosage) return;
        setPrescriptions([...prescriptions, { ...newPrescription, id: Date.now() }]);
        setNewPrescription({
            medication: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        });
    };

    const handleRemovePrescription = (id) => {
        setPrescriptions(prescriptions.filter(p => p.id !== id));
    };

    const handleFinishConsultation = async () => {
        try {
            const consultationData = {
                appointmentId: parseInt(appointmentId),
                notes,
                diagnosis,
                prescriptions
            };
            console.log("Saving consultation:", consultationData);
            await api.post('/consultations', consultationData);
            alert('Consulta finalizada y guardada exitosamente.');
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving consultation", error);
            alert('Error al guardar la consulta.');
        }
    };

    if (loading) return <div className="p-6">Cargando consulta...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header / Patient Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-surface-900 mb-2">Consulta Médica</h1>
                    <div className="flex items-center space-x-4 text-surface-600">
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium">{appointment?.patient?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(appointment?.date).toLocaleDateString()}</span>
                        </div>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {appointment?.reason}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={handleFinishConsultation}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg flex items-center space-x-2 font-medium"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>Finalizar Consulta</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Notes */}
                <div className="lg:col-span-2 space-y-6">
                    {/* SOAP Notes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <FileText className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-bold text-surface-900">Notas Clínicas (SOAP)</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">Subjetivo (Síntomas del paciente)</label>
                                <textarea 
                                    name="subjective" 
                                    value={notes.subjective}
                                    onChange={handleNoteChange}
                                    rows={3}
                                    className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                                    placeholder="El paciente reporta..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">Objetivo (Signos vitales, examen físico)</label>
                                <textarea 
                                    name="objective" 
                                    value={notes.objective}
                                    onChange={handleNoteChange}
                                    rows={3}
                                    className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                                    placeholder="TA: 120/80, FC: 72..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">Análisis (Diagnóstico presuntivo)</label>
                                <textarea 
                                    name="assessment" 
                                    value={notes.assessment}
                                    onChange={handleNoteChange}
                                    rows={2}
                                    className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                                    placeholder="Infección respiratoria aguda..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">Plan (Tratamiento, estudios)</label>
                                <textarea 
                                    name="plan" 
                                    value={notes.plan}
                                    onChange={handleNoteChange}
                                    rows={3}
                                    className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none"
                                    placeholder="Reposo por 3 días, iniciar antibiótico..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                        <h2 className="text-lg font-bold text-surface-900 mb-4">Diagnóstico Final (CIE-10)</h2>
                        <input 
                            type="text" 
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            className="w-full p-3 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                            placeholder="Ej. J00 - Rinofaringitis aguda"
                        />
                    </div>
                </div>

                {/* Right Column: Prescriptions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
                        <h2 className="text-lg font-bold text-surface-900 mb-4">Receta Médica</h2>
                        
                        {/* Add Prescription Form */}
                        <div className="space-y-3 mb-6 bg-surface-50 p-4 rounded-xl border border-surface-100">
                            <input 
                                type="text" 
                                placeholder="Medicamento (ej. Amoxicilina)"
                                value={newPrescription.medication}
                                onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                                className="w-full p-2 border border-surface-200 rounded-lg text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Dosis (ej. 500mg)"
                                    value={newPrescription.dosage}
                                    onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                                    className="w-full p-2 border border-surface-200 rounded-lg text-sm"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Frecuencia (ej. 8hrs)"
                                    value={newPrescription.frequency}
                                    onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                                    className="w-full p-2 border border-surface-200 rounded-lg text-sm"
                                />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Duración (ej. 7 días)"
                                value={newPrescription.duration}
                                onChange={(e) => setNewPrescription({...newPrescription, duration: e.target.value})}
                                className="w-full p-2 border border-surface-200 rounded-lg text-sm"
                            />
                            <textarea 
                                placeholder="Instrucciones adicionales..."
                                value={newPrescription.instructions}
                                onChange={(e) => setNewPrescription({...newPrescription, instructions: e.target.value})}
                                rows={2}
                                className="w-full p-2 border border-surface-200 rounded-lg text-sm resize-none"
                            />
                            <button 
                                onClick={handleAddPrescription}
                                className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-1"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Agregar Medicamento</span>
                            </button>
                        </div>

                        {/* List of Prescriptions */}
                        <div className="space-y-3">
                            {prescriptions.length === 0 ? (
                                <p className="text-sm text-surface-500 text-center italic">No hay medicamentos agregados.</p>
                            ) : (
                                prescriptions.map((p) => (
                                    <div key={p.id} className="flex justify-between items-start p-3 bg-white border border-surface-200 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-bold text-surface-900 text-sm">{p.medication} {p.dosage}</p>
                                            <p className="text-xs text-surface-500">Cada {p.frequency} por {p.duration}</p>
                                            {p.instructions && <p className="text-xs text-surface-400 mt-1">"{p.instructions}"</p>}
                                        </div>
                                        <button 
                                            onClick={() => handleRemovePrescription(p.id)}
                                            className="text-red-400 hover:text-red-600 p-1"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorConsultation;
