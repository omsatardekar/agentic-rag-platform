import React from 'react';
import { Target, Users, Shield, Zap, Globe, Cpu, CheckCircle2, Award, FileCheck2, ArrowRight, Brain } from 'lucide-react';

const About = () => {
    return (
        <div className="pb-24 bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-violet-500/30 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-cyan-600/5 blur-[150px] -z-10" />
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/10 mb-8 animate-float shadow-xl shadow-fuchsia-900/10">
                        <Brain className="w-10 h-10 text-fuchsia-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tighter">
                        We Rebuilt RAG from the  <br />
                        <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 text-transparent bg-clip-text">Ground Up.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-400 leading-relaxed font-medium">
                        Standard Retrieval-Augmented Generation is flawed. It blind-fetches missing context, hallucinates logic, and fails basic reasoning. We're on a mission to build a massive <strong className="text-white">Neural Multi-Agent Router</strong> that actually thinks.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6 border-y border-white/5 bg-slate-900/50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">Our Core Paradigm: <span className="text-violet-400">Agentic Reflection</span></h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
                            If an AI retrieves bad data, it shouldn't just answer incorrectly. It should <strong>grade the failure</strong>, reflect on the missing context, rewrite the user's prompt mathematically, and try again seamlessly without the user ever knowing.
                        </p>
                        <div className="space-y-6">
                            <ValueItem icon={<Shield className="text-cyan-400 w-6 h-6" />} title="Zero-Hallucination Grading" text="Every document retrieved is strictly passed through an evaluation agent before generation." />
                            <ValueItem icon={<Zap className="text-amber-400 w-6 h-6" />} title="Sub-10ms Routing" text="Vector data or Web Search? Our primary Router Agent decides instantly." />
                            <ValueItem icon={<Target className="text-rose-400 w-6 h-6" />} title="Interactive Back-offs" text="If a user's prompt is completely ambiguous, we halt and ask for clarification safely." />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-[40px] blur-2xl opacity-20 animate-pulse-slow" />
                        <div className="relative glass rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl">
                            <div className="grid grid-cols-2 gap-6">
                                <MetricBox value="4" label="Dedicated Agents" />
                                <MetricBox value="Qdrant" label="Vector Store" />
                                <MetricBox value="100%" label="Grading Passes" />
                                <MetricBox value="Tavily" label="Live Web Scraper" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team/Story Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-8 mt-10">
                        <Award className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white tracking-tight">Enterprise Architecture, Open Mission.</h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-16 leading-relaxed font-medium">
                       We provide massive academic compute via Voyage Embeddings to completely encode semantic meaning behind massive PDFs, audio logs, and dynamic web results perfectly natively.
                    </p>

                    <a href="/signup" className="btn-primary inline-flex items-center px-12 py-5 text-xl font-bold rounded-2xl group shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                        Launch Dashboard <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition" />
                    </a>
                </div>
            </section>
        </div>
    );
};

function ValueItem({ icon, title, text }) {
    return (
        <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition group">
            <div className="shrink-0 mt-1">{icon}</div>
            <div>
                <h4 className="text-white font-bold mb-1 tracking-wide">{title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

function MetricBox({ value, label }) {
    return (
        <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/10 text-center hover:border-violet-500/30 transition shadow-lg">
            <div className="text-4xl font-black text-white mb-2">{value}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">{label}</div>
        </div>
    );
}

export default About;
