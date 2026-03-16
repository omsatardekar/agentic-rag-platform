import React, { useState, useEffect } from 'react';
import { Brain, User, Sparkles, ChevronDown, ChevronUp, FileText, Cpu, Copy, Volume2, VolumeX, ExternalLink, Globe } from 'lucide-react';

const ChatMessage = ({ role, content, sources = [], agentFlow = "", shouldType = false, shouldSpeak = false }) => {
    const isAI = role === 'assistant';
    const [showSources, setShowSources] = useState(false);
    const [displayedContent, setDisplayedContent] = useState(shouldType ? "" : content);
    const [isTyping, setIsTyping] = useState(shouldType);
    const [expandedSource, setExpandedSource] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (shouldType && content && role === 'assistant') {
            setDisplayedContent("");
            setIsTyping(true);
            const words = content.split(" ");
            let i = 0;
            const timer = setInterval(() => {
                if (i < words.length) {
                    setDisplayedContent((prev) => prev + (i === 0 ? "" : " ") + words[i]);
                    i++;
                } else {
                    clearInterval(timer);
                    setIsTyping(false);
                    // Auto-speak response if original query was spoken
                    if (shouldSpeak) {
                        try {
                            const utterance = new SpeechSynthesisUtterance(content);
                            utterance.onend = () => setIsSpeaking(false);
                            utterance.onerror = () => setIsSpeaking(false);
                            window.speechSynthesis.cancel();
                            window.speechSynthesis.speak(utterance);
                            setIsSpeaking(true);
                        } catch (e) { console.error("Auto TTS blocked:", e); }
                    }
                }
            }, 30);
            return () => clearInterval(timer);
        } else {
            setDisplayedContent(content);
            setIsTyping(false);
        }
    }, [content, shouldType, role, shouldSpeak]);

    useEffect(() => {
        return () => {
            if (isSpeaking) window.speechSynthesis.cancel();
        };
    }, [isSpeaking]);

    const toggleSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(content);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    return (
        <div className={`w-full flex py-8 md:py-12 border-b border-white/5 ${isAI ? 'bg-slate-900/50 relative' : ''}`}>
            {isAI && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-600 to-indigo-600 shadow-[0_0_15px_rgba(124,58,237,0.3)]" />}

            <div className="max-w-4xl mx-auto flex gap-4 md:gap-8 px-4 md:px-8 w-full relative z-10">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center shadow-2xl transition duration-500 scale-100 hover:scale-110 ${isAI
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 ring-2 ring-violet-500/20'
                    : 'bg-slate-800 border border-white/5'
                    }`}>
                    {role === 'assistant' ? <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <User className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isAI ? 'text-violet-400' : 'text-slate-500'}`}>
                                {isAI ? 'Agentic RAG Assistant' : 'Authorized User'}
                            </span>
                            {isAI && <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-600/10 border border-violet-500/20">
                                <Cpu className="w-3 h-3 text-violet-400" />
                                <span className="text-[9px] font-black text-violet-300 uppercase tracking-tighter">Multi-Agent System</span>
                            </div>}
                        </div>
                        {isAI && !isTyping && (
                            <button onClick={toggleSpeech} className={`p-2 rounded-xl transition group ${isSpeaking ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 'bg-white/5 hover:bg-violet-600/20 text-slate-500 hover:text-violet-400'}`} title={isSpeaking ? "Stop Speaking" : "Listen to Response"}>
                                {isSpeaking ? <VolumeX className="w-4 h-4 group-hover:scale-110 transition" /> : <Volume2 className="w-4 h-4 group-hover:scale-110 transition" />}
                            </button>
                        )}
                    </div>

                    <div className="text-slate-200 leading-[1.8] text-[1.1rem] font-medium whitespace-pre-wrap relative min-h-[1.8em]">
                        {displayedContent}
                        {isTyping && <span className="inline-block w-2 h-5 bg-violet-500 ml-1 animate-pulse align-middle" />}
                    </div>

                    {isAI && !isTyping && (
                        <div className="mt-10 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                            {sources && sources.length > 0 && (
                                <div className="border border-white/5 rounded-3xl overflow-hidden glass shadow-2xl bg-white/[0.02]">
                                    <button
                                        onClick={() => setShowSources(!showSources)}
                                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-violet-400 group-hover:scale-110 transition" />
                                            <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 tracking-wider uppercase">Supporting References ({sources.length})</span>
                                        </div>
                                        {showSources ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </button>

                                    {showSources && (
                                        <div className="px-6 pb-6 pt-2 space-y-3 animate-in fade-in zoom-in-95 duration-300">
                                            {sources.map((src, i) => (
                                                <div key={i} className={`rounded-2xl border transition-all duration-300 ${expandedSource === i ? 'bg-white/5 border-violet-500/50 shadow-xl' : 'bg-white/[0.02] border-white/5 hover:border-violet-500/30'}`}>
                                                    <button 
                                                        onClick={() => setExpandedSource(expandedSource === i ? null : i)}
                                                        className="w-full flex items-center justify-between p-4"
                                                    >
                                                        <div className="flex items-center gap-4 flex-1 min-w-0 text-left">
                                                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition duration-300 ${expandedSource === i ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-violet-600/10 text-violet-400 border border-violet-500/20'}`}>
                                                                {src.url ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="text-[12px] md:text-[13px] font-bold text-slate-200 truncate pr-2">{src.title || 'Untitled Reference'}</div>
                                                                <div className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">{src.url ? 'Web Source' : 'Verified Source'}</div>
                                                            </div>
                                                        </div>
                                                        {expandedSource === i ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4 text-slate-600 pr-2" />}
                                                    </button>
                                                    
                                                    {expandedSource === i && (
                                                        <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                                                            <div className="h-px bg-white/5 mb-4" />
                                                            <div className="text-xs text-slate-400 leading-relaxed font-medium bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                                                {src.content}
                                                            </div>
                                                            {src.url && (
                                                                <a href={src.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 text-[10px] font-bold text-violet-400 hover:text-white transition uppercase">
                                                                    <ExternalLink className="w-3 h-3" /> View Source
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {agentFlow && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5 px-4 md:px-6 py-4 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-inner">
                                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Agent Flow</div>
                                    <div className="hidden sm:block flex-1 h-px bg-white/5" />
                                    <div className="text-[9px] md:text-[10px] font-bold text-violet-400/60 italic tracking-tight break-words w-full sm:w-auto">{agentFlow}</div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={() => navigator.clipboard.writeText(content)}
                                    className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition uppercase tracking-widest px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5 hover:bg-violet-600/10 hover:border-violet-500/30 group"
                                >
                                    <Copy className="w-3.5 h-3.5 group-hover:scale-110 transition" />
                                    Copy Transcript
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
