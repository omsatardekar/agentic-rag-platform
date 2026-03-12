import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Loader2, ChevronRight, User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            await loginWithGoogle(credentialResponse.credential);
            navigate('/chat');
        } catch (err) {
            setError(err || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await login(email, password);
            if (result.user.role === 'admin') navigate('/admin/dashboard');
            else navigate('/chat');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-violet-500/30 overflow-hidden relative">
            {/* Visual Flair */}
            <div className="absolute inset-x-0 -top-40 h-[800px] bg-gradient-to-b from-violet-600/10 to-transparent blur-[120px] -z-10 rounded-full" />

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition duration-500 shadow-2xl shadow-violet-600/30">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-3xl font-bold tracking-tighter text-white">Agentic<span className="text-violet-400">RAG</span></span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-slate-400 text-sm">Please enter your details to sign in.</p>
                </div>

                <div className="glass p-10 rounded-[32px] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden group">
                    {/* Google Login Section */}
                    <div className="space-y-4">
                        <div className="w-full flex justify-center py-2">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Authentication Failed')}
                                type="standard"
                                theme="filled_blue"
                                size="large"
                                text="signin_with"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Or login with email</span>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-medium animate-in fade-in zoom-in-95">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all text-white placeholder-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Your password"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all text-white placeholder-slate-600"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4.5 bg-white text-black hover:bg-slate-100 transition-all text-lg font-bold rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden ${loading ? 'opacity-50' : ''}`}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-slate-500">
                        Don't have an account? <Link to="/signup" className="text-violet-400 hover:text-white font-bold transition-all underline underline-offset-4 decoration-violet-500/30">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
