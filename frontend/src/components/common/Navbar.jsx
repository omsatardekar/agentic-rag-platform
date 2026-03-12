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
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4 shadow-xl shadow-black/50' : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition duration-300 shadow-lg shadow-violet-600/30">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white italic">Agentic<span className="text-violet-400">RAG</span></span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link text-sm font-bold uppercase tracking-widest relative group ${location.pathname === link.path ? 'text-white' : 'text-slate-400'
                                }`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''
                                }`} />
                        </Link>
                    ))}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to={user.role === 'admin' ? '/admin/dashboard' : '/chat'}
                                className="px-6 py-2.5 glass text-white text-xs font-bold rounded-xl hover:bg-white/10 transition flex items-center gap-2"
                            >
                                <User className="w-4 h-4" /> Go to {user.role === 'admin' ? 'Dashboard' : 'Chat'}
                            </Link>
                            <button
                                onClick={logout}
                                className="text-xs font-bold text-rose-400 hover:text-rose-300 uppercase tracking-widest transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="px-6 py-2.5 glass text-white text-xs font-bold rounded-xl hover:bg-white/10 transition group flex items-center gap-2">
                                Login <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                            </Link>
                            <Link to="/signup" className="btn-primary px-8 py-2.5 text-xs font-bold uppercase tracking-widest">
                                Try Free
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full glass border-t border-white/5 py-12 px-6 animate-in slide-in-from-top flex flex-col gap-6 text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-2xl font-bold text-slate-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-4 pt-6 mt-6 border-t border-white/10">
                        {user ? (
                            <Link to="/chat" className="btn-primary py-4" onClick={() => setIsMobileMenuOpen(false)}>Go to Chat</Link>
                        ) : (
                            <>
                                <Link to="/login" className="py-4 glass rounded-2xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                <Link to="/signup" className="btn-primary py-4" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
