import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
    X,
    Moon,
    Sun
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${active
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'text-surface-600 dark:text-gray-300 hover:bg-surface-100 dark:hover:bg-gray-700'}`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-surface-400 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`} />
        <span className="font-medium">{label}</span>
    </button>
);

const DashboardLayout = ({ children, role }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
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
        <div className="min-h-screen bg-surface-50 dark:bg-gray-900 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-surface-200 dark:border-gray-700 fixed h-full z-30">
                <div className="p-6">
                    <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-surface-900 dark:text-white">Smart Clinic</span>
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

                <div className="p-4 border-t border-surface-200 dark:border-gray-700">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center space-x-3 px-4 py-2 mb-2 rounded-lg text-surface-600 dark:text-gray-300 hover:bg-surface-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="text-sm font-medium">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                    </button>

                    <div className="flex items-center space-x-3 mb-4 p-2 bg-surface-50 dark:bg-gray-700/50 rounded-lg border border-surface-100 dark:border-gray-600">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
                            {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user?.name || user?.email}</p>
                            <p className="text-xs text-surface-500 dark:text-gray-400 capitalize">{roleLabels[role] || role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-surface-200 dark:border-gray-600 rounded-lg text-sm font-medium text-surface-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-800 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white dark:bg-gray-800 border-b border-surface-200 dark:border-gray-700 z-40 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                    <Activity className="w-6 h-6" />
                    <span className="font-bold text-surface-900 dark:text-white">Smart Clinic</span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-surface-600 dark:text-gray-300 hover:bg-surface-100 dark:hover:bg-gray-700 p-2 rounded-lg"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-surface-900/50 dark:bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 p-4 shadow-xl border-l border-surface-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
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
                            <div className="pt-4 mt-4 border-t border-surface-200 dark:border-gray-700 space-y-2">
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-surface-600 dark:text-gray-300 hover:bg-surface-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    <span className="font-medium">{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-surface-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </div>
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
