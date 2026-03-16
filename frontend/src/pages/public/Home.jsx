import React, { useState } from 'react';
import { ArrowRight, Brain, Zap, Shield, Database, Sparkles, ChevronRight, FileText, Search, Repeat, FileCheck2, Bot, SlidersHorizontal, Layers, PlayCircle, Globe, Layout, Cpu, Network, Terminal, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import images
import ArchitectureImg from '../../assets/images/architecture.png';
import UiMockupImg from '../../assets/images/ui_mockup.png';
import KnowledgeBaseImg from '../../assets/images/knowledge_base.png';
import CoreIntelImg from '../../assets/images/core_intel.png';

function Home() {
  const [activeTab, setActiveTab] = useState('ingestion');

  const architecturePhases = [
    {
      id: 'ingestion',
      label: 'Preparation',
      icon: <Layers className="w-5 h-5" />,
      title: 'Reliable Data Synthesis',
      desc: 'Our system reads your files (PDF, Word, or text) and organizes them perfectly. It cleans up the text so the AI can understand it without any noise or clutter.',
      image: KnowledgeBaseImg
    },
    {
      id: 'processing',
      label: 'Neural Memory',
      icon: <Cpu className="w-5 h-5" />,
      title: 'High-Fidelity Storage',
      desc: 'Your information is converted into mathematical patterns and stored in a high-speed neural vault. This acts like a digital brain that the AI can recall instantly.',
      image: ArchitectureImg
    },
    {
      id: 'agents',
      label: 'Intelligent Logic',
      icon: <Network className="w-5 h-5" />,
      title: 'Advanced Agentic Reasoning',
      desc: 'Instead of one simple AI, we deploy a network of specialized agents. They verify facts, research online, and cross-reference data to ensure every answer is flawless.',
      image: CoreIntelImg
    }
  ];

  const features = [
    {
      icon: <Search className="w-6 h-6 text-cyan-400" />,
      title: "Smart Discovery",
      desc: "Our logic engine understands exactly what you're looking for, no matter how complex the question."
    },
    {
      icon: <Repeat className="w-6 h-6 text-violet-400" />,
      title: "Self-Refining",
      desc: "If the first retrieval isn't perfect, the AI automatically rewrites the query to find deeper truths."
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-400" />,
      title: "Trust Guard",
      desc: "A dedicated validation agent reviews every single fact to ensure the AI never makes guesses."
    },
    {
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      title: "Universal Search",
      desc: "When internal data isn't enough, the AI safely explores the web for real-time global context."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-x-hidden relative selection:bg-violet-500/30">
      {/* Background Mesh - Optimized for all screens */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-violet-600/10 blur-[120px] md:blur-[180px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-cyan-600/10 blur-[120px] md:blur-[180px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:40px_40px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-400 text-[10px] md:text-sm font-black uppercase tracking-[0.2em] mb-8 md:mb-12 animate-float shadow-2xl">
            <Sparkles className="w-4 h-4" />
            <span>Redefining Artificial Reasoning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-8 md:mb-16 leading-[0.9] text-white">
            Beyond Search. <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text italic drop-shadow-2xl">Pure Logic.</span>
          </h1>

          <p className="max-w-3xl text-lg md:text-2xl text-slate-400 mb-12 md:mb-16 leading-relaxed font-medium px-4 md:px-0">
            We've built an AI system that thinks through your data like a senior researcher. It validates, reflects, and ensures every answer is grounded in absolute truth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-8 w-full sm:w-auto px-6 md:px-0">
            <Link to="/signup" className="group px-10 md:px-14 py-4 md:py-6 rounded-3xl bg-white text-slate-950 font-black text-xl hover:bg-slate-100 hover:scale-[1.03] active:scale-95 transition-all shadow-2xl flex items-center justify-center">
              Start Research <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#about-logic" className="px-10 md:px-14 py-4 md:py-6 rounded-3xl bg-white/5 border border-white/10 text-white font-black text-xl hover:bg-white/10 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center backdrop-blur-xl">
              See the Logic
            </a>
          </div>
        </div>
      </section>

      {/* Qualitative Stats - Fully Responsive */}
      <section className="py-20 px-4 md:px-6 z-10 relative">
        <div className="max-w-7xl mx-auto glass rounded-[3rem] md:rounded-[4rem] p-8 md:p-24 border border-white/5 flex flex-col md:flex-row justify-center md:justify-around gap-12 md:gap-16 text-center">
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic drop-shadow-lg">Verified</div>
            <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Document Integrity</div>
          </div>
          <div className="hidden md:block w-px h-24 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic drop-shadow-lg">Neural</div>
            <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Retrieval Speed</div>
          </div>
          <div className="hidden md:block w-px h-24 bg-white/10 self-center" />
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2 tracking-tighter uppercase italic drop-shadow-lg">Active</div>
            <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Reasoning Engine</div>
          </div>
        </div>
      </section>

      {/* Feature grid with more wow factor */}
      <section className="py-32 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="glass p-10 rounded-[40px] border border-white/5 hover:border-violet-500/30 transition-all hover:-translate-y-2 group shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-violet-600/20 group-hover:scale-110 transition-all duration-500">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Pipeline - Step numbers removed */}
      <section id="about-logic" className="py-24 md:py-40 px-6 relative z-10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 md:mb-28">
            <h2 className="text-4xl md:text-7xl font-bold mb-8 text-white tracking-tight">The <span className="text-violet-400">Agentic Loop</span></h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-2xl font-medium">
              We've replaced standard search with a multi-agent logic loop that guarantees perfect conclusions.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            {/* Tabs / Controls */}
            <div className="lg:col-span-4 space-y-6">
              {architecturePhases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActiveTab(phase.id)}
                  className={`w-full p-8 text-left rounded-3xl border transition-all duration-500 flex items-center gap-6 group
                    ${activeTab === phase.id 
                      ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.1)]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    }
                  `}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500
                    ${activeTab === phase.id ? 'bg-violet-500 text-white scale-110' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}
                  `}>
                    {phase.icon}
                  </div>
                  <div className="flex-1">
                    <span className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 
                      ${activeTab === phase.id ? 'text-violet-400' : 'text-slate-500'}
                    `}>{phase.label}</span>
                    <span className={`block text-xl font-black ${activeTab === phase.id ? 'text-white' : 'text-slate-300'}`}>
                      {phase.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Display Area - Enhanced Imagery */}
            <div className="lg:col-span-8 relative">
              <div className="glass rounded-[48px] md:rounded-[64px] overflow-hidden border border-white/10 shadow-2xl relative group min-h-[500px] md:min-h-[600px] bg-slate-900/50 backdrop-blur-3xl">
                {architecturePhases.map((phase) => (
                  <div 
                    key={phase.id}
                    className={`absolute inset-0 transition-all duration-700 p-8 md:p-16 flex flex-col md:flex-row gap-12 md:gap-16 items-center
                      ${activeTab === phase.id ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-10 pointer-events-none'}
                    `}
                  >
                    <div className="w-full md:w-1/2 space-y-8">
                      <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                        {phase.title}
                      </h3>
                      <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                        {phase.desc}
                      </p>
                      <div className="flex flex-wrap gap-4 pt-4">
                        {['Verified Source', 'Zero Noise', 'Neural Match'].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                            <CheckCircle className="w-3 h-3" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 relative">
                      <div className="absolute -inset-10 bg-gradient-to-tr from-violet-600/30 to-cyan-600/30 blur-[60px] rounded-full animate-pulse-slow opacity-60" />
                      <div className="relative glass border border-white/20 p-2 rounded-[40px] shadow-2xl hover:scale-[1.05] transition-transform duration-700">
                        <img 
                          src={phase.image} 
                          alt={phase.title} 
                          className="rounded-[32px] w-full aspect-square md:aspect-auto object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Section: Neural Reasoning Terminal Look */}
      <section className="py-24 md:py-40 px-6 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative self-stretch flex flex-col justify-center">
              <div className="absolute -inset-10 bg-violet-600/10 blur-[100px] rounded-full" />
              <div className="glass rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="ml-4 flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Terminal className="w-3 h-3" /> Core_Reasoning_Engine.log
                  </div>
                </div>
                
                <div className="space-y-6 font-mono text-sm md:text-base text-slate-400 overflow-y-auto max-h-[400px] custom-scrollbar">
                  <div className="flex gap-4">
                    <span className="text-violet-500 font-bold">[AGENT_1]</span>
                    <span className="flex-1 italic">Query received: "Analyze the long-term impact of neural RAG architectures..."</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-cyan-500 font-bold">[ROUTER]</span>
                    <span className="flex-1">Targeting Knowledge Base [Research_Library_v2]... No ambiguity detected.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-amber-500 font-bold">[GRADER]</span>
                    <span className="flex-1">Retrieving chunks... [4/4] Relevance Score: 0.98. Success.</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-emerald-500 font-bold">[SYSTEM]</span>
                    <span className="flex-1 text-white animate-pulse">Synthesis complete. Formulating expert response...</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Quantum Logic Active</span>
                    </div>
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest font-mono">200 OK</div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-widest">
                <Brain className="w-4 h-4" /> Neural Infrastructure
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
                Observe the <br /> <span className="text-violet-400 italic">Thinking</span> Process.
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
                Transparency is at our core. Unlike black-box search tools, we show you exactly how our agents reason through your queries to deliver verified results.
              </p>
              <div className="flex gap-8">
                <div className="space-y-4">
                    <div className="text-3xl font-black text-white">Trust</div>
                    <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">First Pillar</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="space-y-4">
                    <div className="text-3xl font-black text-white">Logic</div>
                    <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">Second Pillar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA with Wow effect */}
      <section className="py-32 px-6 relative z-10 mb-20 text-center">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 rounded-[64px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-700" />
          <div className="relative glass rounded-[64px] p-20 md:p-32 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900 group-hover:scale-105 transition-transform duration-1000 -z-10" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-tight">Ready to Master <br /> Your Data?</h2>
            <p className="text-lg md:text-2xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium">
              Join elite teams using Agentic RAG to eliminate research guesswork and build the future of intelligence.
            </p>
            <Link
              to="/signup"
              className="px-14 py-6 md:py-8 rounded-[32px] bg-white text-slate-950 font-black text-2xl hover:scale-[1.05] active:scale-95 transition-all inline-flex items-center gap-4 shadow-2xl w-full sm:w-auto justify-center"
            >
              Get Started for Free <Sparkles className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;