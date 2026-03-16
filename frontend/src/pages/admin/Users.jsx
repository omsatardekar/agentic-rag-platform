import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, ShieldCheck, Mail, Calendar, Trash2, Plus, Loader2, Sparkles, UserPlus } from 'lucide-react';
import api from '../../services/api';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    // Admin Creation State
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/users');
            if (response.data.status === 'success') {
                setUsers(response.data.users);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userRole) => {
        if (userRole === 'admin') {
            if (!window.confirm('WARNING: You are about to delete an Admin user. Are you absolutely sure?')) return;
        } else {
            if (!window.confirm('Delete this user? This action cannot be undone.')) return;
        }

        try {
            const response = await api.delete(`/admin/users/${userId}`);
            if (response.data.status === 'success') {
                showToast('User successfully removed', 'success');
                fetchUsers();
            }
        } catch (error) {
            showToast(error.response?.data?.detail || 'Failed to delete user', 'error');
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const response = await api.post('/admin/users/admin', {
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            if (response.data.status === 'success') {
                showToast('Super-Admin account successfully created!', 'success');
                setShowAdminModal(false);
                setAdminEmail('');
                setAdminPassword('');
                fetchUsers();
            }
        } catch (error) {
            showToast(error.response?.data?.detail || 'Failed to create admin', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const showToast = (msg, type) => {
        setStatusMessage({ msg, type });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'Unknown';
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 flex items-center gap-3 tracking-tight">
                        <UsersIcon className="w-6 h-6 text-rose-400" />
                        Platform Identity
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">Manage user access and security roles.</p>
                </div>
                <button 
                    onClick={() => setShowAdminModal(true)}
                    className="w-full md:w-auto btn-primary shadow-violet-600/20 px-8 py-3.5 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"
                >
                    <UserPlus className="w-4 h-4" /> Add Admin
                </button>
            </div>

            {/* Users Table */}
            <div className="glass-card overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-white/5">
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Auth Type</th>
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined On</th>
                                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Security Role</th>
                                <th className="p-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-violet-400 mx-auto" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-slate-500 italic">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${u.role === 'admin' ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-rose-500/20' : 'bg-slate-800 border border-white/10 text-slate-300'}`}>
                                                    {u.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-200 group-hover:text-white transition">{u.email}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                        <Mail className="w-3 h-3" /> User ID ID: {u.id.substring(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block ${u.auth_provider === 'google' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-400 bg-slate-400/10'}`}>
                                                {u.auth_provider === 'google' ? 'Google OAuth' : 'Local Auth'}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                {formatDate(u.created_at)}
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {u.role === 'admin' ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 w-fit">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                                                    <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Admin</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-white/5 w-fit">
                                                    <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">User</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button 
                                                onClick={() => handleDeleteUser(u.id, u.role)}
                                                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admin Creation Modal */}
            {showAdminModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md glass rounded-[32px] p-8 border border-white/10 shadow-2xl scale-in-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white text-center mb-2">Create Administrator</h2>
                        <p className="text-slate-400 text-sm text-center font-medium mb-8">Grant system-wide administrative privileges with a temporary account configuration.</p>
                        
                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Temporary Email</label>
                                <input
                                    required
                                    type="email"
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    placeholder="admin.temp@organization.com"
                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-violet-500 transition"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Initial Password</label>
                                <input
                                    required
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Choose a strong temporary password"
                                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium focus:outline-none focus:border-violet-500 transition"
                                />
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAdminModal(false)}
                                    className="flex-1 py-4 text-slate-300 font-bold hover:text-white hover:bg-white/5 rounded-2xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 py-4 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 disabled:scale-95 disabled:opacity-50"
                                >
                                    {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                    Create Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Status Toast */}
            {statusMessage && (
                <div className={`fixed top-12 right-12 z-[300] px-6 py-4 rounded-2xl glass border flex items-center gap-4 animate-in slide-in-from-right duration-300 ${statusMessage.type === 'error' ? 'border-rose-500/30 text-rose-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold text-sm">{statusMessage.msg}</span>
                </div>
            )}
        </div>
    );
};

export default UsersList;
