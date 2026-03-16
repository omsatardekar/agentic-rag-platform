import React from 'react';
import { User, Settings as SettingsIcon, ShieldCheck, Mail, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-bold">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-y-auto selection:bg-violet-500/30 font-sans custom-scrollbar py-12 md:py-24 px-4 md:px-8">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] pointer-events-none rounded-full" />
            
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <button onClick={() => navigate(-1)} className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-violet-400 transition mb-4 block">
                            ← Back
                        </button>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                            <SettingsIcon className="w-8 h-8 md:w-12 md:h-12 text-violet-500" /> Account Settings
                        </h1>
                        <p className="text-slate-400 font-medium tracking-tight mt-2 text-sm md:text-base">
                            Manage your Agentic RAG profile and preferences.
                        </p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="glass-card p-6 md:p-10 border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                        {/* Avatar */}
                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-violet-500/30 transition duration-500 shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition duration-500" />
                            <User className="w-10 h-10 md:w-14 md:h-14 text-slate-600 group-hover:text-violet-400 transition duration-500 relative z-10" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                                <div className="bg-slate-900/50 p-4 md:p-5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Email Address</span>
                                    </div>
                                    <div className="text-sm md:text-base font-bold text-white truncate break-all">{user.email}</div>
                                </div>
                                
                                <div className="bg-slate-900/50 p-4 md:p-5 rounded-2xl border border-white/5 flex flex-col justify-center">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                                <ShieldCheck className="w-4 h-4" />
                                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Account Status</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-sm md:text-base font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5 w-full">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-white/5 w-full sm:w-auto justify-center">
                                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-widest">Role: {user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid md:grid-cols-1 gap-6 pt-6">
                    <div className="glass-card p-6 md:p-8 border-rose-500/10 hover:border-rose-500/30 transition group">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-400 transition">Session Control</h3>
                        <p className="text-sm text-slate-400 mb-6 font-medium">Log out of your current session. You will be required to log in again to access the Agentic RAG systems.</p>
                        
                        <button
                            onClick={handleLogout}
                            className="w-full md:w-auto px-8 py-4 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 rounded-2xl font-black uppercase tracking-widest text-xs transition flex items-center justify-center gap-3 active:scale-95 group/btn"
                        >
                            <LogOut className="w-4 h-4 group-hover/btn:translate-x-1 transition" /> Logout Device
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
