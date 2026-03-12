import React, { useState } from 'react';
import { ArrowRight, Brain, Zap, Shield, Database, Sparkles, ChevronRight, FileText, Search, Repeat, FileCheck2, Bot, SlidersHorizontal, Layers, PlayCircle, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  const [activeNode, setActiveNode] = useState(null);

  const architectureNodes = [
    {
      id: "ingestion",
      icon: <Layers className="w-8 h-8 text-emerald-400" />,
      title: "1. Data Ingestion",
      color: "emerald",
      desc: "Robust Data Connectors handle PDFs, TXTs, Images, and Videos. It preprocesses, cleans, and chunks your unstructured data perfectly for vectorization."
    },
    {
      id: "embedding",
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "2. Embedding Model",
      color: "amber",
      desc: "Transforms raw text and multimodal chunks into high-dimensional vector embeddings, mathematically mapping semantic meaning."
    },
    {
      id: "vector",
      icon: <Database className="w-8 h-8 text-rose-400" />,
      title: "3. Vector Database",
      color: "rose",
      desc: "An ultra-fast Qdrant vector store that acts as our long-term memory, retrieving context-aware responses with sub-10ms latency."
    },
    {
      id: "router",
      icon: <SlidersHorizontal className="w-8 h-8 text-cyan-400" />,
      title: "Agent 1: Query Router",
      color: "cyan",
      desc: "The traffic director. Analyzes user queries in real-time and routes them to vector search, Web Search, or Interactive Query based on intent."
    },
    {
      id: "rewrite",
      icon: <Repeat className="w-8 h-8 text-cyan-400" />,
      title: "Agent 2: Query Rewrite",
      color: "cyan",
      desc: "If initial document retrieval fails grading, this agent steps in to dynamically rewrite and optimize the prompt for a better search."
    },
    {
      id: "reflective_1",
      icon: <Brain className="w-8 h-8 text-cyan-400" />,
      title: "Agent 3: Reflective Rewrite",
      color: "cyan",
      desc: "Deeply analyzes failed vector retrievals, reflecting on 'why' it failed, and structures complex logic to try again."
    },
    {
      id: "interactive",
      icon: <Bot className="w-8 h-8 text-fuchsia-400" />,
      title: "Interactive Query",
      color: "fuchsia",
      desc: "If a user query is too ambiguous, the system halts and asks the user for clarification before burning compute cycles."
    },
    {
      id: "web",
      icon: <Globe className="w-8 h-8 text-amber-300" />,
      title: "Web Search Fallback",
      color: "amber",
      desc: "When internal vectors don't contain the answer, the Router seamlessly shifts to live Web Search to inject real-time data."
    },
    {
      id: "reflective_2",
      icon: <Search className="w-8 h-8 text-cyan-400" />,
      title: "Agent 4: Reflective Web",
      color: "cyan",
      desc: "Grades live web results and rewrites them into clean, structured context ready for final generation."
    },
    {
      id: "grade",
      icon: <FileCheck2 className="w-8 h-8 text-yellow-300" />,
      title: "Grade Documents",
      color: "yellow",
      desc: "The critical logic gate. Evaluates every retrieved document for relevance. If it passes, it goes to generation. If not, it triggers a rewrite."
    },
    {
      id: "generative",
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      title: "Generative Engine",
      color: "blue",
      desc: "The final step. Synthesizes all passing documents and web context into a clean, accurate, hallucination-free response."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden relative selection:bg-violet-500/30">
      {/* Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-violet-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-400 text-xs font-bold uppercase tracking-widest mb-10 animate-float shadow-xl shadow-violet-900/10">
            <Sparkles className="w-4 h-4" />
            <span>Agentic RAG v2.1 is Live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-white">
            Beyond Retrieval. <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 text-transparent bg-clip-text">True Intelligence.</span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-400 mb-12 leading-relaxed font-medium">
            We don't just search documents. Our multi-agent neural architecture routes, reflects, rewrites, and grades context in real-time to completely eliminate hallucinations.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link to="/signup" className="px-10 py-4 lg:py-4.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(139,92,246,0.5)] flex items-center justify-center">
              Start Building <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a href="#architecture" className="px-10 py-4 lg:py-4.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center backdrop-blur-md">
              Explore Architecture
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Architecture Section */}
      <section id="architecture" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white">The <span className="text-violet-400">Agentic Core</span> Architecture</h2>
            <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl leading-relaxed">
              Hover over any node in our pipeline to see exactly how our intelligent agents process, grade, and rewrite your queries to guarantee 100% accuracy.
            </p>
          </div>

          {/* Dynamic Grid Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {architectureNodes.map((node) => (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                className={`relative group p-8 rounded-[32px] border transition-all duration-500 cursor-default overflow-hidden
                  ${activeNode === node.id 
                    ? `bg-${node.color}-900/20 border-${node.color}-500/50 scale-[1.02] shadow-[0_0_40px_rgba(var(--${node.color}-500),0.2)]` 
                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }
                `}
                style={{
                  // Setting CSS variables for the dynamic color glow
                  '--emerald-500': '16, 185, 129',
                  '--amber-500': '245, 158, 11',
                  '--rose-500': '244, 63, 94',
                  '--cyan-500': '6, 182, 212',
                  '--fuchsia-500': '217, 70, 239',
                  '--blue-500': '59, 130, 246',
                  '--yellow-500': '234, 179, 8'
                }}
              >
                {/* Background Glow on Active */}
                <div className={`absolute -inset-10 bg-${node.color}-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-500 ${activeNode === node.id ? `bg-${node.color}-500/20 shadow-${node.color}-500/20 scale-110` : 'bg-slate-900 border border-white/10'}`}>
                    {node.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${activeNode === node.id ? 'text-white' : 'text-slate-300'}`}>
                    {node.title}
                  </h3>
                  <p className={`text-sm font-medium leading-relaxed transition-colors duration-300 ${activeNode === node.id ? 'text-slate-200' : 'text-slate-500'}`}>
                    {node.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Agent Details */}
      <section className="py-32 px-6 relative z-10 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">How the <span className="text-cyan-400">Router Agent</span> Works</h2>
              <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                When a user asks a question, it doesn't just blindly hit a database. Our <strong className="text-white">Query Router (Agent 1)</strong> intercepts the input and logically classifies the intent. 
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition group">
                  <Bot className="w-8 h-8 text-violet-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold mb-1">Interactive Clarification</h4>
                    <p className="text-slate-400 text-sm">If the query is ambiguous, it bounces back to the user instantly, asking clarifying questions instead of hallucinating.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition group">
                  <Database className="w-8 h-8 text-cyan-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold mb-1">Vector DB Routing</h4>
                    <p className="text-slate-400 text-sm">For document-specific questions, it routes directly to the Qdrant database to pull localized knowledge chunks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition group">
                  <Globe className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold mb-1">Live Web Search</h4>
                    <p className="text-slate-400 text-sm">If the data requires current real-world knowledge, the router triggers a Tavily Web Search, and sends the results to Agent 4 for grading.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-600 to-violet-600 rounded-[40px] blur-2xl opacity-20 animate-pulse-slow" />
              <div className="relative glass rounded-[40px] p-2 border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" 
                  alt="Agentic Routing Visualization" 
                  className="rounded-[32px] w-full object-cover aspect-square md:aspect-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[40px] blur opacity-10 group-hover:opacity-25 transition duration-500" />
          <div className="relative glass rounded-[40px] p-16 md:p-24 text-center border-white/5 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/20 blur-[100px] -z-10 rounded-full" />

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tighter">Experience Cognitive RAG</h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg md:text-xl font-medium">
              Join the elite researchers and developers building hallucination-free AI.
            </p>
            <Link
              to="/signup"
              className="px-12 py-5 rounded-2xl bg-white text-slate-900 font-bold text-xl hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Start Free Trial <Sparkles className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;