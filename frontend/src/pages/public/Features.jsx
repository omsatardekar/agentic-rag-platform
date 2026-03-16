import React from 'react';
import { Target, Users, Shield, Zap, Globe, Cpu, CheckCircle2, FileText, Database, ShieldCheck, Search, Play, ArrowRight, BrainCircuit, Network, Fingerprint, ActivitySquare, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import assets
import UiMockupImg from '../../assets/images/ui_mockup.png';

const Features = () => {
    return (
        <div className="pb-32 bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-violet-500/30 overflow-x-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/10 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] -z-10 rounded-full mix-blend-screen" />
            
            {/* Header */}
            <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-8 animate-float shadow-xl shadow-cyan-900/20">
                        <Network className="w-4 h-4" />
                        <span>Professional AI Assistance</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold mb-8 text-white tracking-tighter leading-[1.1]">
                        The Smartest <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 text-transparent bg-clip-text">Research Engine</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-xl text-slate-400 md:leading-relaxed font-medium px-4">
                        We've built more than just a search tool. Our system uses a multi-step intelligent process that organizes, validates, and refines information until it's perfectly accurate for your needs.
                    </p>
                </div>
            </section>

            {/* Main Core Features Matrix */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                <FeatureCard
                    icon={<BrainCircuit className="w-8 h-8 text-violet-400" />}
                    title="Intelligent Assistant"
                    description="Our frontline AI understands your questions instantly. It decides whether to search your documents or look for live answers online."
                    bgGlow="violet"
                />
                <FeatureCard
                    icon={<Network className="w-8 h-8 text-cyan-400" />}
                    title="Self-Correction System"
                    description="If a search isn't helpful, the AI automatically rewrites the query and tries again until it finds the right information."
                    bgGlow="cyan"
                />
                <FeatureCard
                    icon={<ActivitySquare className="w-8 h-8 text-rose-400" />}
                    title="Smart Memory Link"
                    description="Our system analyzes every piece of data to find hidden connections, making sure no important detail is ever missed."
                    bgGlow="rose"
                />
                <FeatureCard
                    icon={<Globe className="w-8 h-8 text-amber-400" />}
                    title="Live Web Updates"
                    description="When documents aren't enough, the AI safely explores the web to bring you the most current facts and figures."
                    bgGlow="amber"
                />
                <FeatureCard
                    icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />}
                    title="Fact-Checked Results"
                    description="Every answer is triple-checked for accuracy. This prevents the AI from making guesses and ensures you get reliable data."
                    bgGlow="emerald"
                />
                <FeatureCard
                    icon={<Database className="w-8 h-8 text-fuchsia-400" />}
                    title="High-Speed Storage"
                    description="Your documents are stored in a specialized digital brain that allows for instant recall of any fact, anytime."
                    bgGlow="fuchsia"
                />
            </section>

            {/* Visual Feature Breakdown */}
            <section className="py-24 md:py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto glass rounded-[40px] p-8 md:p-20 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4" />

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white tracking-tight">Reliable & Transparent <br /><span className="text-violet-400">Information Pipeline</span></h2>
                            <p className="text-base md:text-lg text-slate-400 mb-10 leading-relaxed font-medium">
                                We've moved beyond simple "question and answer" bots. 
                                <br/><br/>
                                Our system follows a professional research process: it gathers data, grades its relevance, corrects its own mistakes, and only then provides a structured, helpful response.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div className="space-y-4">
                                    <SmallFeature icon={<Check className="text-violet-500 w-5 h-5" />} text="Dynamic Routing" />
                                    <SmallFeature icon={<Check className="text-violet-500 w-5 h-5" />} text="Data Validation" />
                                    <SmallFeature icon={<Check className="text-violet-500 w-5 h-5" />} text="Intent Discovery" />
                                </div>
                                <div className="space-y-4">
                                    <SmallFeature icon={<Check className="text-violet-500 w-5 h-5" />} text="Live Facts" />
                                    <SmallFeature icon={<Check className="text-violet-500 w-5 h-5" />} text="Auto-Correction" />
                                    <SmallFeature icon={<Check className="text-violet-500 w-5 h-5" />} text="Secure Privacy" />
                                </div>
                            </div>
                        </div>

                        <div className="relative glass-card w-full max-w-lg mx-auto p-4 border border-white/20 transition-transform duration-700 rounded-[40px] shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent blur-md opacity-50 rounded-[40px]" />
                            <img
                                src={UiMockupImg}
                                alt="System UI Mockup"
                                className="w-full h-full object-cover rounded-[32px] opacity-90"
                            />
                            <div className="absolute -bottom-6 -right-6 glass border border-white/20 w-fit px-8 py-5 animate-float rounded-3xl shadow-2xl">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verification Status</div>
                                </div>
                                <div className="text-2xl md:text-3xl font-black text-white">Trustworthy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center px-6 mt-10 relative z-10">
                <div className="max-w-4xl mx-auto glass p-16 rounded-[48px] border border-white/10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-10 text-white">Ready to change how you research?</h2>
                    <Link to="/signup" className="btn-primary px-12 py-5 text-xl font-bold inline-flex items-center group shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:scale-105 transition-all rounded-2xl">
                        Get Started for Free <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

function FeatureCard({ icon, title, description, bgGlow }) {
    const glowColors = {
        violet: 'bg-violet-600/10 hover:bg-violet-600/20 border-violet-500/10 hover:border-violet-500/30 shadow-violet-500/10',
        cyan: 'bg-cyan-600/10 hover:bg-cyan-600/20 border-cyan-500/10 hover:border-cyan-500/30 shadow-cyan-500/10',
        rose: 'bg-rose-600/10 hover:bg-rose-600/20 border-rose-500/10 hover:border-rose-500/30 shadow-rose-500/10',
        amber: 'bg-amber-600/10 hover:bg-amber-600/20 border-amber-500/10 hover:border-amber-500/30 shadow-amber-500/10',
        emerald: 'bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-500/10 hover:border-emerald-500/30 shadow-emerald-500/10',
        fuchsia: 'bg-fuchsia-600/10 hover:bg-fuchsia-600/20 border-fuchsia-500/10 hover:border-fuchsia-500/30 shadow-fuchsia-500/10'
    };

    const iconColors = {
        violet: 'text-violet-400 bg-violet-600/20',
        cyan: 'text-cyan-400 bg-cyan-600/20',
        rose: 'text-rose-400 bg-rose-600/20',
        amber: 'text-amber-400 bg-amber-600/20',
        emerald: 'text-emerald-400 bg-emerald-600/20',
        fuchsia: 'text-fuchsia-400 bg-fuchsia-600/20'
    }

    return (
        <div className={`glass p-10 rounded-[40px] group relative overflow-hidden transition-all duration-500 border ${glowColors[bgGlow]}`}>
            <div className={`w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mb-8 shadow-xl transition-transform duration-500 group-hover:scale-110 relative ${iconColors[bgGlow]}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{title}</h3>
            <p className="text-slate-400 leading-relaxed font-medium relative z-10 group-hover:text-slate-300 transition-colors">{description}</p>
        </div>
    );
}

function SmallFeature({ icon, text }) {
    return (
        <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition group">
            <div className="group-hover:scale-110 transition shrink-0 bg-violet-500/20 p-2 rounded-lg">{icon}</div>
            <span className="text-slate-200 font-bold text-sm tracking-wide">{text}</span>
        </div>
    );
}

export default Features;
