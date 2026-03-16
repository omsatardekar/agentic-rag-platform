import React, { useState } from 'react';
import { ArrowRight, Brain, Zap, Shield, Database, Sparkles, ChevronRight, FileText, Search, Repeat, FileCheck2, Bot, SlidersHorizontal, Layers, PlayCircle, Globe, Layout, Cpu, Network } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import images
import ArchitectureImg from '../../assets/images/architecture.png';
import UiMockupImg from '../../assets/images/ui_mockup.png';
import KnowledgeBaseImg from '../../assets/images/knowledge_base.png';

function Home() {
  const [activeTab, setActiveTab] = useState('ingestion');

  const architecturePhases = [
    {
      id: 'ingestion',
      label: '1. Preparation',
      icon: <Layers className="w-5 h-5" />,
      title: 'Reliable Data Preparation',
      desc: 'Our system reads your files (PDF, Word, or text) and organizes them. It cleans up the text so the AI can understand it easily without any clutter.',
      image: KnowledgeBaseImg
    },
    {
      id: 'processing',
      label: '2. Smart Memory',
      icon: <Cpu className="w-5 h-5" />,
      title: 'Digital Brain Storage',
      desc: 'Your information is converted into mathematical patterns and stored in a high-speed database. This acts like a long-term memory that the AI can recall in milliseconds.',
      image: ArchitectureImg
    },
    {
      id: 'agents',
      label: '3. Intelligent Agents',
      icon: <Network className="w-5 h-5" />,
      title: 'Advanced AI Research Team',
      desc: 'Instead of one simple AI, we use multiple "Agents" that work together. They check each other\'s work, search the web if needed, and make sure every answer is accurate.',
      image: UiMockupImg
    }
  ];

  const features = [
    {
      icon: <Search className="w-6 h-6 text-cyan-400" />,
      title: "Smart Navigation",
      desc: "Our 'Router' understands exactly what you're asking and finds the best way to get the answer."
    },
    {
      icon: <Repeat className="w-6 h-6 text-violet-400" />,
      title: "Self-Correction",
      desc: "If the first attempt isn't perfect, the AI automatically rewrites the query to try again."
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-400" />,
      title: "Accuracy Guard",
      desc: "A dedicated 'Grader' reviews every piece of information to prevent the AI from making things up."
    },
    {
      icon: <Globe className="w-6 h-6 text-amber-400" />,
      title: "Live Web Search",
      desc: "Whenever your documents aren't enough, the AI safely searches the web for the latest facts."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-x-hidden relative selection:bg-violet-500/30">
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-violet-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 md:mb-10 animate-float shadow-xl shadow-violet-900/10">
            <Sparkles className="w-4 h-4" />
            <span>Advanced Research Assistant is Live</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1] text-white">
            Smart Research. <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">Zero Guesswork.</span>
          </h1>

          <p className="max-w-2xl text-base md:text-xl text-slate-400 mb-10 md:mb-12 leading-relaxed font-medium px-4">
            We've built an AI system that works like a high-end research team. It organizes your documents, validates every fact, and ensures you get accurate answers every time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto px-4">
            <Link to="/signup" className="px-8 md:px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(139,92,246,0.5)] flex items-center justify-center">
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a href="#architecture" className="px-8 md:px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center backdrop-blur-md">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Responsive feature grid */}
      <section className="py-20 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Architecture Section */}
      <section id="architecture" className="py-24 md:py-32 px-6 relative z-10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Our <span className="text-violet-400">Intelligent Pipeline</span></h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-base md:text-lg">
              We process data through three advanced stages to ensure your research assistant is the smartest one ever built.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Tabs / Controls */}
            <div className="lg:col-span-4 space-y-4">
              {architecturePhases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setActiveTab(phase.id)}
                  className={`w-full p-6 text-left rounded-2xl border transition-all duration-300 flex items-center gap-4
                    ${activeTab === phase.id 
                      ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.1)]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    }
                  `}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center 
                    ${activeTab === phase.id ? 'bg-violet-500 text-white' : 'bg-slate-800 text-slate-400'}
                  `}>
                    {phase.icon}
                  </div>
                  <div>
                    <span className={`block text-xs font-bold uppercase tracking-wider mb-1 
                      ${activeTab === phase.id ? 'text-violet-400' : 'text-slate-500'}
                    `}>{phase.label}</span>
                    <span className={`block font-bold ${activeTab === phase.id ? 'text-white' : 'text-slate-300'}`}>
                      {phase.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Display Area */}
            <div className="lg:col-span-8">
              <div className="glass rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/10 shadow-2xl relative group min-h-[400px] md:min-h-[500px]">
                {architecturePhases.map((phase) => (
                  <div 
                    key={phase.id}
                    className={`absolute inset-0 transition-all duration-700 p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center
                      ${activeTab === phase.id ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-10 pointer-events-none'}
                    `}
                  >
                    <div className="w-full md:w-1/2 space-y-6">
                      <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
                        {phase.title}
                      </h3>
                      <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                        {phase.desc}
                      </p>
                      <ul className="space-y-3">
                        {['Fast Recovery', 'High Accuracy', 'Easy Setup'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                            <FileCheck2 className="w-5 h-5 text-emerald-400" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-full md:w-1/2 relative">
                      <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-cyan-600/20 blur-2xl rounded-full" />
                      <img 
                        src={phase.image} 
                        alt={phase.title} 
                        className="rounded-3xl w-full aspect-square md:aspect-auto object-cover shadow-2xl relative z-10 border border-white/10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 px-6 z-10 relative">
        <div className="max-w-7xl mx-auto glass rounded-[40px] p-10 md:p-16 border border-white/5 flex flex-wrap justify-center md:justify-around gap-12 text-center">
          <div>
            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">100%</div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">Verified Accuracy</div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/10" />
          <div>
            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">&lt;10ms</div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">Response Time</div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/10" />
          <div>
            <div className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">Unlimited</div>
            <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">Data Connections</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[40px] blur opacity-10 group-hover:opacity-20 transition duration-500" />
          <div className="relative glass rounded-[40px] p-12 md:p-24 text-center border-white/5 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/20 blur-[100px] -z-10 rounded-full" />
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">Start Your Smart Research Today</h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg md:text-xl font-medium">
              Join thousands of students and teachers building the future of accurate AI.
            </p>
            <Link
              to="/signup"
              className="px-10 md:px-12 py-5 rounded-2xl bg-white text-slate-900 font-bold text-lg md:text-xl hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] w-full sm:w-auto justify-center"
            >
              Get Started for Free <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;