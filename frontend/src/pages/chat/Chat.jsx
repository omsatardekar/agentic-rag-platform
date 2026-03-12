import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, LogIn, UserPlus, MessageSquare, ChevronRight, Share2, MoreHorizontal, Loader2 } from 'lucide-react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatMessage from '../../components/chat/ChatMessage';
import ChatInput from '../../components/chat/ChatInput';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Chat = () => {
    const defaultMessage = { role: 'assistant', content: "Hello! I'm your AI assistant. You can upload documents in the dashboard and I'll help you analyze them. What would you like to know?" };

    const [messages, setMessages] = useState([defaultMessage]);
    const [history, setHistory] = useState([]);
    const [activeConvId, setActiveConvId] = useState(null);
    const [promptCount, setPromptCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { user, loading: authLoading } = useAuth();
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isThinking]);

    // Initial load logic
    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchHistory();
                setIsSidebarOpen(true);
            } else {
                setMessages([defaultMessage]);
                setIsSidebarOpen(false); // Guest mode
                const savedCount = localStorage.getItem('rag_trial_count');
                if (savedCount) setPromptCount(parseInt(savedCount));
            }
            setIsInitialLoad(false);
        }
    }, [user, authLoading]);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/history/conversations');
            if (response.data.status === 'success') {
                setHistory(response.data.conversations);
            }
        } catch (err) {
            console.error('History error', err);
        }
    };

    const loadConversation = async (convId) => {
        setIsThinking(true);
        setActiveConvId(convId);
        try {
            const response = await api.get(`/history/messages/${convId}`);
            if (response.data.status === 'success') {
                setMessages(response.data.messages);
            }
        } catch (err) {
            console.error('Load error', err);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSendMessage = async (text, isVoice = false) => {
        if (!user && promptCount >= 5) {
            setShowLoginModal(true);
            return;
        }

        const currentConvId = activeConvId || `conv_${Date.now()}`;
        if (!activeConvId) setActiveConvId(currentConvId);

        const newMessages = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setIsThinking(true);

        if (!user) {
            const newCount = promptCount + 1;
            setPromptCount(newCount);
            localStorage.setItem('rag_trial_count', newCount.toString());
        }

        try {
            const response = await api.post('/chat/query', {
                message: text,
                conversation_id: currentConvId,
                history: messages.filter(m => m.role !== 'system') // Pass previous messages
            });

            const assistantMsg = {
                role: 'assistant',
                content: response.data.response,
                sources: response.data.sources,
                agent_flow: response.data.agent_flow,
                shouldType: true,
                shouldSpeak: isVoice
            };
            setMessages(prev => [...prev, assistantMsg]);

            if (user) fetchHistory();
        } catch (error) {
            console.error('Chat error', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I had trouble processing that. Please check if the server is running."
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleNewChat = () => {
        setMessages([defaultMessage]);
        setActiveConvId(null);
        if (!user) setIsSidebarOpen(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Chat link copied to clipboard!");
    };

    if (authLoading || isInitialLoad) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#020617] overflow-hidden">
            {user && (
                <ChatSidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onNewChat={handleNewChat}
                    history={history}
                    activeConvId={activeConvId}
                    onSelectConv={loadConversation}
                    username={user.email.split('@')[0]}
                />
            )}

            <main className={`flex-1 flex flex-col relative transition-all duration-300 ${user && isSidebarOpen ? 'ml-72' : 'ml-0'}`}>

                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-900/20 backdrop-blur-md z-20">
                    <div className="flex items-center gap-3">
                        {(!isSidebarOpen || !user) && (
                            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <h2 className="text-sm font-bold text-slate-200">
                            AI Assistant <span className="text-violet-500">•</span> <span className="text-emerald-500 text-[10px] uppercase font-bold">Online</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {!user && (
                            <button onClick={() => navigate('/login')} className="px-4 py-1.5 border border-white/10 text-white text-xs font-bold rounded-full hover:bg-white/5 transition flex items-center gap-2">
                                <LogIn className="w-4 h-4" /> Sign In ({promptCount}/5 Free)
                            </button>
                        )}
                        <button onClick={handleShare} className="p-2 text-slate-500 hover:text-white transition group" title="Share Chat">
                            <Share2 className="w-4 h-4 group-hover:scale-110 transition" />
                        </button>
                    </div>
                </header>

                {/* Chat Messages */}
                <div className={`flex-1 overflow-y-auto pt-6 scroll-smooth custom-scrollbar ${!user ? 'flex flex-col items-center' : ''}`}>
                    <div className={`w-full ${!user ? 'max-w-2xl px-6' : 'max-w-4xl mx-auto px-6'}`}>
                        {/* Welcome message for guests */}
                        {messages.length <= 1 && !user && (
                            <div className="py-20 text-center space-y-6">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 mx-auto flex items-center justify-center shadow-2xl">
                                    <Brain className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-white tracking-tight">How can I help you?</h1>
                                <p className="text-slate-400 font-medium">Ask me anything about your uploaded documents or general topics.</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <ChatMessage
                                    key={idx}
                                    role={msg.role}
                                    content={msg.content}
                                    sources={msg.sources}
                                    agentFlow={msg.agentFlow || msg.agent_flow}
                                    shouldType={msg.shouldType}
                                    shouldSpeak={msg.shouldSpeak}
                                />
                            ))}
                        </div>

                        {isThinking && (
                            <div className="flex gap-4 p-6 bg-white/5 rounded-2xl animate-pulse mt-4">
                                <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                </div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-2 bg-white/10 rounded w-1/4" />
                                    <div className="h-2 bg-white/5 rounded w-full" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-10" />
                    </div>
                </div>

                {/* Input Section */}
                <div className="shrink-0 p-6 bg-[#020617] border-t border-white/5 relative z-20">
                    <div className={!user ? '' : 'max-w-4xl mx-auto'}>
                        <ChatInput onSend={handleSendMessage} disabled={showLoginModal} isCentered={!user} />
                        <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest mt-4">
                            Powered by Agentic RAG • AI can make mistakes.
                        </p>
                    </div>
                </div>
            </main>

            {/* Simple Trial Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
                    <div className="bg-slate-900 p-10 rounded-[40px] max-w-sm w-full text-center border border-white/10 shadow-2xl">
                        <div className="w-16 h-16 rounded-2xl bg-violet-600 mx-auto flex items-center justify-center shadow-lg mb-6">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Free Limit Reached</h2>
                        <p className="text-slate-400 mb-8 font-medium">
                            Please sign in to keep chatting and save your history.
                        </p>
                        <div className="space-y-3">
                            <button onClick={() => navigate('/signup')} className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition">Create Account</button>
                            <button onClick={() => navigate('/login')} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition">Login</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
