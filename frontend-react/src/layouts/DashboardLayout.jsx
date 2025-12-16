import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    User,
    Settings,
    Calendar,
    FileText,
    CreditCard,
    Activity,
    Menu,
    X
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${active
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'text-surface-600 hover:bg-surface-100'}`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-surface-400 group-hover:text-primary-600'}`} />
        <span className="font-medium">{label}</span>
    </button>
);

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const getMenuItems = () => {
        const common = [
            { icon: LayoutDashboard, label: 'Resumen', path: '/dashboard' },
        ];

        if (role === 'patient') {
            return [
                ...common,
                { icon: Calendar, label: 'Reservar Cita', path: '/book-appointment' },
                { icon: FileText, label: 'Mis Registros', path: '/records' }, // Placeholder
                { icon: User, label: 'Perfil', path: '/profile' },
            ];
        }
        if (role === 'doctor') {
            return [
                ...common,
                { icon: Calendar, label: 'Agenda', path: '/schedule' },
                { icon: User, label: 'Pacientes', path: '/patients' },
            ];
        }
        if (role === 'admin') {
            return [
                ...common,
                { icon: Activity, label: 'Auditoría', path: '/admin/audit-logs' },
                { icon: CreditCard, label: 'Pagos', path: '/admin/payments' },
            ];
        }
        return common;
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const roleLabels = {
        patient: 'Paciente',
        doctor: 'Doctor',
        admin: 'Administrador'
    };

    return (
        <div className="min-h-screen bg-surface-50 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-surface-200 fixed h-full z-30">
                <div className="p-6">
                    <div className="flex items-center space-x-2 text-primary-600">
                        <div className="p-2 bg-primary-100 rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-surface-900">Smart Clinic</span>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {getMenuItems().map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-surface-200">
                    <div className="flex items-center space-x-3 mb-4 p-2 bg-surface-50 rounded-lg border border-surface-100">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                            {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate">{user?.name || user?.email}</p>
                            <p className="text-xs text-surface-500 capitalize">{roleLabels[role] || role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-surface-200 rounded-lg text-sm font-medium text-surface-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white border-b border-surface-200 z-40 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-primary-600">
                    <Activity className="w-6 h-6" />
                    <span className="font-bold text-surface-900">Smart Clinic</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-surface-900/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 h-full w-64 bg-white p-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="mt-16 space-y-2">
                            {getMenuItems().map((item) => (
                                <SidebarItem
                                    key={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    active={location.pathname === item.path}
                                    onClick={() => handleNavigation(item.path)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0 transition-all duration-300">
                <div className="max-w-7xl mx-auto animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
