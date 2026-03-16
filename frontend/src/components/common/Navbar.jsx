import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Features', path: '/features' },
        { name: 'About', path: '/about' },
        { name: 'Docs', path: '/chat' },
    ];

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-2 md:py-4 shadow-2xl' : 'bg-transparent py-4 md:py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between relative">
                
                {/* Desktop: Centered Navigation */}
                <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-[12px] md:text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group overflow-hidden py-2 ${location.pathname === link.path ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`}
                        >
                            <span className="relative z-10">{link.name}</span>
                            <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-violet-500 to-transparent transition-transform duration-500 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-110'}`} />
                        </Link>
                    ))}
                </div>

                {/* Left: Brand */}
                <Link to="/" className="flex items-center gap-3 group relative z-50">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center group-hover:rotate-12 transition duration-500 shadow-xl shadow-violet-600/30 ring-1 ring-white/20">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl md:text-2xl font-black tracking-tighter text-white leading-none">Agentic<span className="text-violet-400">RAG</span></span>
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Intelligence Platform</span>
                    </div>
                </Link>

                {/* Right: Auth & Toggle */}
                <div className="flex items-center gap-3 md:gap-5 relative z-50">
                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin/dashboard' : '/chat'}
                                    className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition flex items-center gap-2"
                                >
                                    <User className="w-4 h-4 text-violet-400" /> Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-[11px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition px-4 py-2">Login</Link>
                                <Link to="/signup" className="btn-primary !px-6 !py-2.5 !rounded-2xl text-[11px] font-black uppercase tracking-widest">
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Integrated Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300">
                    <div className="flex flex-col h-full pt-32 pb-12 px-8 overflow-y-auto">
                        <div className="flex flex-col gap-8 text-left">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-4xl font-black uppercase tracking-tighter transition-all duration-300 flex items-center justify-between group
                                        ${location.pathname === link.path ? 'text-white' : 'text-slate-700'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                    <ChevronRight className={`w-8 h-8 transition-transform group-hover:translate-x-2 ${location.pathname === link.path ? 'text-violet-500' : 'text-slate-800'}`} />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="h-px bg-white/5 w-full mb-8" />
                            {user ? (
                                <div className="space-y-4">
                                    <Link 
                                        to={user.role === 'admin' ? '/admin/dashboard' : '/chat'} 
                                        className="w-full btn-primary !py-5 !rounded-3xl text-lg font-black uppercase tracking-widest"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Enter Dashboard
                                    </Link>
                                    <button 
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="w-full py-4 text-slate-500 font-black uppercase tracking-widest"
                                    >
                                        Sign Out Session
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" className="py-5 bg-white/5 border border-white/10 text-white rounded-3xl text-center font-black uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                    <Link to="/signup" className="btn-primary !py-5 !rounded-3xl text-center font-black uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Join</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
