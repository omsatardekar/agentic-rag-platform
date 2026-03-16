import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, MessageSquare, Plus, LogOut, Settings, History, ChevronLeft, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ChatSidebar = ({ isOpen, toggleSidebar, username = "User", history = [], activeConvId }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`fixed inset-y-0 left-0 w-72 h-screen bg-[#020617] border-r border-white/5 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full md:translate-x-0'
                }`}>
                {/* Header */}
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-2 group mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:rotate-12 transition duration-500">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white italic">Agentic<span className="text-violet-400">RAG</span></span>
                    </Link>

                    <button
                        onClick={() => navigate('/chat')}
                        className="w-full flex items-center gap-3 px-5 py-3.5 bg-violet-600/10 border border-violet-500/20 rounded-2xl text-violet-400 font-bold text-sm hover:bg-violet-600 hover:text-white transition-all duration-300 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition duration-300" />
                        New Chat
                    </button>
                </div>

                {/* History Flow */}
                <div className="flex-grow overflow-y-auto px-4 custom-scrollbar pb-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                                <History className="w-4 h-4" />
                                Chat History
                            </div>
                            <div className="space-y-1">
                                {history.length > 0 ? history.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(`/chat/${item.id}`)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium relative hover:bg-white/5 ${activeConvId === item.id
                                                ? 'bg-white/10 text-white shadow-lg'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <MessageSquare className={`w-4 h-4 shrink-0 ${activeConvId === item.id ? 'text-violet-400' : ''}`} />
                                        <span className="truncate">{item.title}</span>
                                    </button>
                                )) : (
                                    <div className="px-6 py-8 text-center text-slate-600 italic text-xs leading-relaxed">
                                        No recent chats.<br />Try asking something.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Footer */}
                <div className="p-4 bg-slate-900/30 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl group transition duration-300 border border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-400 text-lg uppercase shadow-lg">
                            {username[0]}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-bold text-white truncate">{username}</div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Signed in</div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleLogout}
                            className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition flex items-center justify-center group active:scale-95"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition flex items-center justify-center group active:scale-95"
                            title="Account Settings"
                        >
                            <Settings className="w-5 h-5 group-hover:rotate-90 transition duration-500" />
                        </button>
                    </div>
                </div>

                {/* Collapse toggle (Mobile) */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-slate-900 border border-white/10 rounded-r-xl shadow-xl"
                >
                    <ChevronLeft className={`w-6 h-6 transform transition ${isOpen ? '' : 'rotate-180'}`} />
                </button>
            </aside>
        </>
    );
};

export default ChatSidebar;
