import React, { useState } from 'react';
import { Target, Users, Shield, Zap, Globe, Cpu, CheckCircle2, FileText, Database, ShieldCheck, Search, Play, ArrowRight, BrainCircuit, Network, Fingerprint, ActivitySquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
    return (
        <div className="pb-32 bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-violet-500/30 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/10 blur-[150px] -z-10 rounded-full" />
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] -z-10 rounded-full mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay -z-10" />

            {/* Header */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-bold tracking-widest uppercase mb-8 animate-float shadow-xl shadow-cyan-900/20">
                        <Network className="w-4 h-4" />
                        <span>Multi-Agent Capabilities</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tighter leading-[1.1]">
                        The Ultimate <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 text-transparent bg-clip-text">Cognitive Engine</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-400 md:leading-relaxed font-medium">
                        Experience the power of a fully agentic RAG system. We've replaced simple linear retrieval with a massive, multi-step neural loop that grades, reflects, and rewrites context until perfection is achieved.
                    </p>
                </div>
            </section>

            {/* Main Core Features Matrix */}
            <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                <FeatureCard
                    icon={<BrainCircuit className="w-8 h-8 text-violet-400" />}
                    title="Agent 1: Query Router"
                    description="Our frontline AI intercepts queries. It semantically analyzes intent, deciding exactly whether to ping the local Vector DB, fire off a live external Web Search, or halt and ask the user for Interaction."
                    bgGlow="violet"
                />
                <FeatureCard
                    icon={<Network className="w-8 h-8 text-cyan-400" />}
                    title="Agent 2: Query Rewrite"
                    description="If initial text retrieves junk data, Agent 2 steps in automatically. It structurally rewrites the user's prompt into higher-dimensional mathematical representations for a second search attempt."
                    bgGlow="cyan"
                />
                <FeatureCard
                    icon={<ActivitySquare className="w-8 h-8 text-rose-400" />}
                    title="Agent 3: Reflective DB"
                    description="Deeply analyzes 'failed' vector retrievals. It reflects on the exact missing nodes in the document grading logic, synthesizing complex logic to attempt deeper, secondary vector fetches."
                    bgGlow="rose"
                />
                <FeatureCard
                    icon={<Globe className="w-8 h-8 text-amber-400" />}
                    title="Agent 4: Reflective Web"
                    description="Grades external live web results. If a scraped webpage contains messy, theoretical data, Agent 4 strips the noise and rewrites it into clean, structured context."
                    bgGlow="amber"
                />
                <FeatureCard
                    icon={<Fingerprint className="w-8 h-8 text-emerald-400" />}
                    title="Strict Document Grading"
                    description="The critical logic gate before generation. Passes or fails retrieved chunks of text. If a chunk fails, it triggers rewrites. Hallucinations are mathematically eliminated here."
                    bgGlow="emerald"
                />
                <FeatureCard
                    icon={<Database className="w-8 h-8 text-fuchsia-400" />}
                    title="Sub-10ms Vector Store"
                    description="Powered by a dedicated Qdrant cluster. This acts as the long-term, embedded neural memory, instantaneously retrieving massive chunks of text based on the Agentic loops."
                    bgGlow="fuchsia"
                />
            </section>

            {/* Visual Feature Breakdown */}
            <section className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto glass rounded-[40px] p-8 md:p-16 border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4" />

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white tracking-tight">Zero-Hallucination<br /><span className="text-violet-400">Processing Pipeline</span></h2>
                            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium">
                                We abandoned the standard RAG pipeline (Retrieve -> Generate).
                                <br/><br/>
                                Our pipeline leverages continuous cycles of retrieving, grading, reflecting on failures, rewriting queries, and optionally fetching live internal web data before allowing the Generative Engine to speak. 
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <SmallFeature icon={<CheckCircle2 className="text-violet-500 w-6 h-6" />} text="Dynamic Routing" />
                                    <SmallFeature icon={<CheckCircle2 className="text-violet-500 w-6 h-6" />} text="Document Grading" />
                                    <SmallFeature icon={<CheckCircle2 className="text-violet-500 w-6 h-6" />} text="Intent Clarification" />
                                </div>
                                <div className="space-y-5">
                                    <SmallFeature icon={<CheckCircle2 className="text-violet-500 w-6 h-6" />} text="Web Fallbacks" />
                                    <SmallFeature icon={<CheckCircle2 className="text-violet-500 w-6 h-6" />} text="Reflective Cycles" />
                                    <SmallFeature icon={<CheckCircle2 className="text-violet-500 w-6 h-6" />} text="Auto-Rewrite Loops" />
                                </div>
                            </div>
                        </div>

                        <div className="relative glass-card aspect-square max-w-lg mx-auto p-4 border border-white/20 group-hover:rotate-1 transition-transform duration-700 rounded-3xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent blur-md opacity-50 rounded-3xl" />
                            <img
                                src="https://images.unsplash.com/photo-1639322537231-2f206e06dd8b?q=80&w=1000&auto=format&fit=crop"
                                alt="Process Flow"
                                className="w-full h-full object-cover rounded-2xl opacity-90 shadow-2xl"
                            />
                            <div className="absolute -bottom-6 -left-6 glass border border-white/20 w-fit px-8 py-5 animate-float rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Grading Status</div>
                                </div>
                                <div className="text-3xl font-black text-white">100% Pass</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center px-6 mt-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white">Ready to Deploy Advanced Agents?</h2>
                <Link to="/signup" className="btn-primary px-12 py-5 text-xl font-bold inline-flex items-center group shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:scale-105 transition-all">
                    Start Free Trial <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition" />
                </Link>
            </section>
        </div>
    );
};

function FeatureCard({ icon, title, description, bgGlow }) {
    const glowColors = {
        violet: 'bg-violet-600/10 group-hover:bg-violet-600/20 border-violet-500/10 hover:border-violet-500/30 shadow-violet-500/10',
        cyan: 'bg-cyan-600/10 group-hover:bg-cyan-600/20 border-cyan-500/10 hover:border-cyan-500/30 shadow-cyan-500/10',
        rose: 'bg-rose-600/10 group-hover:bg-rose-600/20 border-rose-500/10 hover:border-rose-500/30 shadow-rose-500/10',
        amber: 'bg-amber-600/10 group-hover:bg-amber-600/20 border-amber-500/10 hover:border-amber-500/30 shadow-amber-500/10',
        emerald: 'bg-emerald-600/10 group-hover:bg-emerald-600/20 border-emerald-500/10 hover:border-emerald-500/30 shadow-emerald-500/10',
        fuchsia: 'bg-fuchsia-600/10 group-hover:bg-fuchsia-600/20 border-fuchsia-500/10 hover:border-fuchsia-500/30 shadow-fuchsia-500/10'
    };

    const iconColors = {
        violet: 'text-violet-400 bg-violet-600/20 shadow-violet-500/20 -inset-1 bg-violet-500/10',
        cyan: 'text-cyan-400 bg-cyan-600/20 shadow-cyan-500/20 -inset-1 bg-cyan-500/10',
        rose: 'text-rose-400 bg-rose-600/20 shadow-rose-500/20 -inset-1 bg-rose-500/10',
        amber: 'text-amber-400 bg-amber-600/20 shadow-amber-500/20 -inset-1 bg-amber-500/10',
        emerald: 'text-emerald-400 bg-emerald-600/20 shadow-emerald-500/20 -inset-1 bg-emerald-500/10',
        fuchsia: 'text-fuchsia-400 bg-fuchsia-600/20 shadow-fuchsia-500/20 -inset-1 bg-fuchsia-500/10'
    }

    return (
        <div className={`glass p-10 rounded-[32px] group relative overflow-hidden transition-all duration-500 border hover:scale-[1.02] shadow-xl ${glowColors[bgGlow]}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-100 transition duration-700 rounded-full ${iconColors[bgGlow].split(' ').pop()}`} />
            
            <div className={`w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mb-8 shadow-xl transition-transform duration-500 group-hover:scale-110 relative ${iconColors[bgGlow].split(' ')[1]}`}>
                <div className={`absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition duration-500 rounded-2xl ${iconColors[bgGlow].split(' ')[1]}`} />
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
            <div className="group-hover:scale-110 transition shrink-0">{icon}</div>
            <span className="text-slate-200 font-bold text-sm tracking-wide">{text}</span>
        </div>
    );
}

export default Features;
