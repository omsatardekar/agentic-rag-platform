import React from 'react';
import { Target, Users, Shield, Zap, Globe, Cpu, CheckCircle2, Award, FileCheck2, ArrowRight, Brain, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import assets
import ArchitectureImg from '../../assets/images/architecture.png';

const About = () => {
    return (
        <div className="pb-24 bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-violet-500/30 overflow-x-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-cyan-600/5 blur-[150px] -z-10" />
            
            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/10 mb-8 animate-float shadow-xl shadow-fuchsia-900/10">
                        <Brain className="w-10 h-10 text-fuchsia-400" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold mb-8 text-white tracking-tighter leading-tight">
                        We Built a Smarter <br />
                        <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 text-transparent bg-clip-text">Research Partner.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-xl text-slate-400 leading-relaxed font-medium px-4">
                        Traditional search tools often struggle with complex questions. We're on a mission to build an intelligent assistant that truly understands your documents and provides accurate, verified answers every time.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 md:py-24 px-6 border-y border-white/5 bg-slate-900/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">Our Core Principle: <span className="text-violet-400">Intelligent Reflection</span></h2>
                        <p className="text-slate-400 text-base md:text-lg mb-8 leading-relaxed font-medium">
                            If an AI makes a mistake, it shouldn't just give you a wrong answer. Our system is designed to **check its own work**, recognize when it needs more information, and refine its search until it gets it right.
                        </p>
                        <div className="space-y-4 md:space-y-6">
                            <ValueItem icon={<Shield className="text-cyan-400 w-6 h-6" />} title="Accuracy Checking" text="Every answer is reviewed by a specialized AI 'Grader' before you see it." />
                            <ValueItem icon={<Zap className="text-amber-400 w-6 h-6" />} title="Smart Routing" text="Our system decides instantly whether to use your documents or look for live news online." />
                            <ValueItem icon={<Target className="text-rose-400 w-6 h-6" />} title="User Interaction" text="If your question is unclear, the AI will ask for clarification instead of guessing." />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-[40px] blur-2xl opacity-20 animate-pulse-slow" />
                        <div className="relative glass rounded-[40px] p-6 md:p-12 border border-white/10 shadow-2xl">
                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <MetricBox value="4" label="AI Agents" />
                                <MetricBox value="Qdrant" label="Smart Memory" />
                                <MetricBox value="100%" label="Fact Checked" />
                                <MetricBox value="Tavily" label="Live Search" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Story Section */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
                        <Award className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-10 text-white tracking-tight">Professional Quality, Simple to Use.</h2>
                    <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 mb-16 leading-relaxed font-medium">
                       We use industry-leading technology to help students and teachers understand their research materials better than ever before. No complex jargon, just clear and accurate results.
                    </p>

                    <div className="relative max-w-2xl mx-auto mb-16 px-4">
                         <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-violet-600 rounded-3xl blur opacity-25" />
                         <img 
                            src={ArchitectureImg} 
                            alt="Architecture" 
                            className="relative rounded-3xl w-full object-cover border border-white/10 shadow-2xl"
                         />
                    </div>

                    <Link to="/signup" className="btn-primary inline-flex items-center px-12 py-5 text-xl font-bold rounded-2xl group shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                        Get Started <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

function ValueItem({ icon, title, text }) {
    return (
        <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition group">
            <div className="shrink-0 mt-1 bg-white/5 p-3 rounded-xl">{icon}</div>
            <div>
                <h4 className="text-white font-bold mb-1 tracking-wide">{title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

function MetricBox({ value, label }) {
    return (
        <div className="p-6 md:p-8 bg-slate-900/50 rounded-2xl border border-white/10 text-center hover:border-violet-500/30 transition shadow-lg">
            <div className="text-3xl md:text-5xl font-black text-white mb-2">{value}</div>
            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-bold">{label}</div>
        </div>
    );
}

export default About;
