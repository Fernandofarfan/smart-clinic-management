import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                // Check if user is logged in on mount
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');

                if (token && storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (parseError) {
                        console.error("Failed to parse stored user", parseError);
                        localStorage.removeItem('user'); // Clear corrupted data
                    }
                }
            } catch (error) {
                console.error("Auth initialization error", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password, role) => {
        try {
            // Determine endpoint based on role (or use a unified login if supported)
            // Legacy backend had different endpoints, we might have upgraded but kept paths
            // Assuming /api/auth/login or role specific
            // Based on README: /api/{role}s/login
            const endpoint = role === 'admin' ? '/admin/login'
                : role === 'doctor' ? '/doctors/login'
                    : '/patients/login';

            const response = await api.post(endpoint, { email, password });

            const { token, ...responseData } = response.data;

            // Extract the user object (it could be under 'admin', 'doctor', or 'patient' key)
            const userObj = responseData.admin || responseData.doctor || responseData.patient || responseData;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ ...userObj, role }));

            setUser({ ...userObj, role });
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl font-semibold text-indigo-600">Loading Application...</div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
