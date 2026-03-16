import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, CheckCircle2, ArrowRight, Loader2, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            await loginWithGoogle(credentialResponse.credential);
            navigate('/chat');
        } catch (err) {
            setError(err || 'Signup with Google Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(email, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 bg-slate-950/50 selection:bg-violet-500/20 overflow-hidden relative">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-20 items-center">

                {/* Left side: Branding */}
                <div className="hidden lg:block space-y-12 animate-in slide-in-from-left duration-1000">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="w-16 h-16 rounded-[28px] bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition duration-500 shadow-2xl shadow-violet-600/30">
                            <Brain className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-4xl font-bold tracking-tighter text-white">Agentic<span className="text-violet-400">RAG</span></span>
                    </Link>

                    <h2 className="text-6xl font-bold tracking-tight text-white leading-tight">
                        Build your private <br />
                        <span className="gradient-text italic">AI Knowledge Base.</span>
                    </h2>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5 transition duration-300">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <span className="text-2xl text-slate-200 font-bold group-hover:text-white transition tracking-tight">Access GPT-level Reasoning</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5 transition duration-300">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <span className="text-2xl text-slate-200 font-bold group-hover:text-white transition tracking-tight">Native Multi-Agent Support</span>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5 transition duration-300">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                            <span className="text-2xl text-slate-200 font-bold group-hover:text-white transition tracking-tight">100% Privacy & Encrypted storage</span>
                        </div>
                    </div>
                </div>

                {/* Right side: Form (Matching Login) */}
                <div className="max-w-md w-full mx-auto relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 to-transparent blur-3xl -z-10 rounded-full transition group-hover:opacity-50 duration-1000" />

                    <div className="glass p-10 rounded-[40px] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-3xl">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Create Account</h1>
                            <p className="text-slate-500 text-sm italic">Join 50k+ users syncing their data.</p>
                        </div>

                        {/* REAL Google Login Component */}
                        <div className="space-y-4">
                            <div className="w-full flex justify-center py-2">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google Authentication Failed')}
                                    type="standard"
                                    theme="filled_blue"
                                    size="large"
                                    text="signup_with"
                                    shape="pill"
                                    width="100%"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 py-2">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Or sign up with email</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-bold italic animate-in fade-in zoom-in-95">{error}</div>}
                            {success && <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center font-bold italic animate-in slide-in-from-top">Successfully registered. Log in now.</div>}

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all text-white placeholder-slate-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Your password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all text-white placeholder-slate-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-white text-black hover:bg-slate-100 transition-all text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden"
                            >
                                {loading ? 'Creating...' : 'Join Now'}
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>
                        </form>

                        <p className="text-center text-sm font-medium text-slate-500">
                            Already have an account? <Link to="/login" className="text-violet-400 hover:text-white font-bold transition-all underline underline-offset-4 decoration-violet-500/30">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
