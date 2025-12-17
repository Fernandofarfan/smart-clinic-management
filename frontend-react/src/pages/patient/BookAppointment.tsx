import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BookAppointment = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: '',
        symptoms: '',
        notes: ''
    });

    // Fetch doctors on mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/doctors');
                setDoctors(response.data);
            } catch (err) {
                console.error("Error fetching doctors", err);
                setError("Error al cargar la lista de doctores.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Combine date and time to ISO format
            // Assuming simplified ISO string for now, backend expects LocalDateTime
            const appointmentTime = `${formData.date}T${formData.time}:00`;

            const payload = {
                patientId: user.id,
                doctorId: parseInt(formData.doctorId),
                appointmentTime: appointmentTime,
                symptoms: formData.symptoms,
                notes: formData.notes
            };

            const response = await api.post('/appointments', payload);
            setSuccess(response.data);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error("Booking error", err);
            setError(err.response?.data?.message || "Error al reservar la cita. Por favor intenta de nuevo.");
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900">¡Cita Reservada!</h2>
                <p className="text-lg font-mono bg-gray-100 px-4 py-2 rounded mt-2">ID: {success.appointmentId}</p>
                <p className="text-gray-600 mt-2">Redirigiéndote al panel...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Volver al Panel
            </button>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4">
                    <h1 className="text-xl font-bold text-white flex items-center">
                        <Calendar className="w-6 h-6 mr-2" />
                        Reservar Nueva Cita
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Doctor Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Doctor</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <select
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- Elige un Especialista --</option>
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>
                                        Dr. {doc.firstName} {doc.lastName} - {doc.specialty}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Síntomas / Razón</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                required
                                rows="3"
                                placeholder="Describe tus síntomas o la razón de la visita..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting || loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                ${submitting || loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                        >
                            {submitting ? 'Reservando...' : 'Confirmar Cita'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
