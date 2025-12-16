import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Activity, X } from 'lucide-react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('patient');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password, role);
        if (result.success) {
            toast.success('¡Bienvenido de nuevo!');
            navigate('/dashboard');
        } else {
            setError(result.message);
            toast.error(result.message || 'Error al iniciar sesión');
        }
    };


    return (
        <div className="min-h-screen flex bg-surface-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Left Side - Image/Brand Area */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-primary-900/90 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Medical Innovation"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                />
                <div className="relative z-20 flex flex-col justify-center px-12 text-white h-full">
                    <div className="mb-6">
                        <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                            <span className="text-3xl">🏥</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 font-sans tracking-tight">Smart Clinic</h1>
                        <p className="text-xl text-primary-100 max-w-md">
                            Gestión clínica de próxima generación para profesionales modernos.
                        </p>
                    </div>
                    <div className="flex gap-4 text-sm text-primary-200 font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                            Seguro
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                            Rápido
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
                            Confiable
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-surface-50 dark:bg-gray-900 relative transition-colors duration-300">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                    <Activity className="w-64 h-64 text-primary-200 dark:text-primary-900/20" />
                </div>

                <div className="w-full max-w-md space-y-8 z-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">{t('login.title')}</h2>
                        <p className="mt-2 text-sm text-surface-500 dark:text-gray-400">Inicia sesión para acceder a tu panel</p>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-card rounded-2xl p-8 border border-white/50 dark:border-gray-700 transition-colors duration-300">
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {/* Role Selection Tabs */}
                            <div>
                                <label className="block text-xs font-semibold text-surface-400 dark:text-gray-500 uppercase tracking-wider mb-3">Seleccionar Portal</label>
                                <div className="flex p-1 bg-surface-100 dark:bg-gray-700 rounded-xl transition-colors duration-300">
                                    {[
                                        { id: 'patient', label: 'Paciente' },
                                        { id: 'doctor', label: 'Doctor' },
                                        { id: 'admin', label: 'Admin' }
                                    ].map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id)}
                                            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 capitalize
                                                ${role === r.id
                                                    ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                                    : 'text-surface-500 dark:text-gray-400 hover:text-surface-700 dark:hover:text-gray-200 hover:bg-surface-200/50 dark:hover:bg-gray-600/50'}`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-gray-300">{t('login.email')}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-primary-500">
                                        <Mail className="h-5 w-5 text-surface-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        id="email"
                                        type="text"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-surface-200 dark:border-gray-600 rounded-xl leading-5 bg-surface-50 dark:bg-gray-700 placeholder-surface-400 dark:placeholder-gray-500 text-surface-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                                        placeholder="nombre@smartclinic.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-gray-300">{t('login.password')}</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-primary-500">
                                        <Lock className="h-5 w-5 text-surface-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-surface-200 dark:border-gray-600 rounded-xl leading-5 bg-surface-50 dark:bg-gray-700 placeholder-surface-400 dark:placeholder-gray-500 text-surface-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800 flex items-start">
                                    <div className="flex-shrink-0">
                                        <X className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow"
                            >
                                {t('login.submit')}
                            </button>
                        </form>
                    </div>

                    <div className="text-center text-xs text-surface-400 dark:text-gray-500">
                        &copy; 2024 Gestión Smart Clinic. Sistema Seguro.
                    </div>
                </div>
            </div>
        </div>
    );
}
