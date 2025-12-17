import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '' // Optional for update
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.id) {
                try {
                    const response = await api.get(`/patients/${user.id}`);
                    const p = response.data;
                    setFormData({
                        name: p.name || '',
                        email: p.email || '',
                        phone: p.phone || '',
                        address: p.address || '',
                        password: ''
                    });
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    setMessage({ type: 'error', text: 'Error al cargar datos del perfil.' });
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await api.put(`/patients/${user.id}`, formData);
            setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
            // Ideally update context user if name changed, but skipping for now
        } catch (error) {
            console.error("Update failed", error);
            setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando perfil...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Mi Perfil
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {message.text && (
                        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <div className="mt-1">
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico (Solo Lectura)</label>
                            <div className="mt-1">
                                <input
                                    name="email"
                                    type="email"
                                    readOnly
                                    value={formData.email}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-500 sm:text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <div className="mt-1">
                                <input
                                    name="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <div className="mt-1">
                                <input
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nueva Contraseña (Opcional)</label>
                            <div className="mt-1">
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Dejar en blanco para mantener la actual"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
