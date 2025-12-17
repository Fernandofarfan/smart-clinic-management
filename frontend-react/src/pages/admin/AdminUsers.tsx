import React, { useState, useEffect } from 'react';
import { Search, Trash, Edit, UserCheck, UserX, Shield } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users", error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleToggleStatus = async (id, type) => {
        try {
            await api.put(`/admin/users/${id}/status`, null, { params: { type } });
            setUsers(users.map(user => 
                user.id === id && user.type === type ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
            ));
        } catch (error) {
            console.error("Error toggling status", error);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-surface-900">Gestión de Usuarios</h2>
                    <p className="text-surface-500">Administra cuentas de doctores, pacientes y administradores</p>
                </div>
            </div>

            {/* Filters */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-surface-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface-50 border-b border-surface-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {filteredUsers.map((user) => (
                            <tr key={`${user.type}-${user.id}`} className="hover:bg-surface-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-surface-600 font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-surface-900">{user.name}</p>
                                            <p className="text-xs text-surface-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border capitalize
                                        ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                          user.role === 'doctor' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                          'bg-green-50 text-green-700 border-green-100'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border 
                                        ${user.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button 
                                            onClick={() => handleToggleStatus(user.id, user.type)}
                                            className={`p-2 rounded-lg transition-colors ${user.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-surface-400 hover:bg-surface-100'}`}
                                            title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                                        >
                                            {user.status === 'active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
