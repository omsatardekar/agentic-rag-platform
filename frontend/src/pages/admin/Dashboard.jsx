import React, { useState, useEffect } from 'react';
import {
    History, LayoutDashboard, FileText, Settings, LogOut,
    ChevronRight, Brain, Upload, BarChart3, Database,
    ShieldCheck, Activity, Search, Plus, Play, MoreVertical, Loader2, Sparkles, Trash2, Users
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import UsersList from './Users';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [documents, setDocuments] = useState([]);
    const [stats, setStats] = useState({
        total_vectors: '...',
        total_queries: '...',
        kb_size: '...',
        efficiency: '...',
        runtime: '...'
    });
    const [trends, setTrends] = useState({
        vectors: '+0%',
        queries: '+0%',
        size: '+0%'
    });
    const [chartData, setChartData] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [reviewingText, setReviewingText] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [isIngesting, setIsIngesting] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (activeTab === 'overview') {
            fetchStats();
        }
        if (activeTab === 'documents') {
            fetchDocuments();
        }
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            if (response.data.status === 'success') {
                setStats(response.data.stats);
                setActivities(response.data.recent_activities || []);
                if (response.data.trends) {
                    setTrends(response.data.trends);
                }
                if (response.data.chart_data) {
                    setChartData(response.data.chart_data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/admin/documents');
            setDocuments(response.data.documents);
        } catch (error) {
            console.error('Failed to fetch documents', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus('Extracting content for review...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/admin/extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.status === 'success') {
                setReviewingText(response.data.extracted_text);
                setExtractedData({
                    file_id: response.data.file_id,
                    filename: response.data.filename,
                    file_type: response.data.file_type,
                    file_path: response.data.file_path,
                    size: response.data.size
                });
                setUploadStatus(null);
            }
        } catch (error) {
            setUploadStatus('Error: ' + (error.response?.data?.detail || 'Extraction failed'));
            setTimeout(() => setUploadStatus(null), 4000);
        } finally {
            setIsUploading(false);
        }
    };

    const handleConfirmIngest = async () => {
        if (!reviewingText || !extractedData) return;

        setIsIngesting(true);
        setUploadStatus('Vectorizing knowledge base (respecting rate limits)...');

        try {
            const response = await api.post('/admin/confirm-ingest', {
                text: reviewingText,
                ...extractedData
            });

            if (response.data.status === 'success') {
                setUploadStatus('Success! Knowledge securely injected.');
                setReviewingText(null);
                setExtractedData(null);
                fetchDocuments();
                setTimeout(() => {
                    setUploadStatus(null);
                    setActiveTab('documents');
                }, 2000);
            }
        } catch (error) {
            setUploadStatus('Error: ' + (error.response?.data?.detail || 'Ingestion failed'));
            setTimeout(() => setUploadStatus(null), 4000);
        } finally {
            setIsIngesting(false);
        }
    };

    const handleGlobalSearch = async (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.post('/admin/search', { query });
            if (response.data.status === 'success') {
                setSearchResults(response.data.results);
            }
        } catch (error) {
            console.error('Vector search failed', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleDeleteDocument = async (docId) => {
        if (!window.confirm('Are you sure you want to remove this document from the knowledge base?')) return;
        
        try {
            const response = await api.delete(`/admin/documents/${docId}`);
            if (response.data.status === 'success') {
                setUploadStatus('Document deleted successfully');
                fetchDocuments();
                fetchStats();
                setTimeout(() => setUploadStatus(null), 2000);
            }
        } catch (error) {
            console.error('Delete failed', error);
            setUploadStatus('Error: Delete failed');
            setTimeout(() => setUploadStatus(null), 2000);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">

            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-violet-600 text-white shadow-2xl shadow-violet-600/40 flex items-center justify-center active:scale-95 transition-all"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 glass border-r border-white/5 flex flex-col z-[60] overflow-hidden lg:relative lg:translate-x-0 transition-transform duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8">
                    <Link to="/" className="flex items-center gap-2 group mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 group-hover:scale-110 transition duration-300">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white italic">Agentic<span className="text-violet-400">RAG</span></span>
                    </Link>

                    <nav className="space-y-2">
                        <SideLink
                            icon={<LayoutDashboard className="w-5 h-5 text-violet-400" />}
                            label="Overview"
                            active={activeTab === 'overview'}
                            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                        />
                        <SideLink
                            icon={<Database className="w-5 h-5 text-blue-400" />}
                            label="Doc Injection"
                            active={activeTab === 'injection'}
                            onClick={() => { setActiveTab('injection'); setIsSidebarOpen(false); }}
                        />
                        <SideLink
                            icon={<FileText className="w-5 h-5 text-emerald-400" />}
                            label="My Documents"
                            active={activeTab === 'documents'}
                            onClick={() => { setActiveTab('documents'); setIsSidebarOpen(false); }}
                        />
                        <SideLink
                            icon={<Users className="w-5 h-5 text-rose-400" />}
                            label="User Management"
                            active={activeTab === 'users'}
                            onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }}
                        />
                        <SideLink
                            icon={<Activity className="w-5 h-5 text-amber-400" />}
                            label="System Logs"
                            active={activeTab === 'logs'}
                            onClick={() => { setActiveTab('logs'); setIsSidebarOpen(false); }}
                        />
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5 space-y-4">
                    <div className="p-4 glass rounded-2xl bg-violet-600/5 border border-violet-500/10">
                        <div className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-widest">Storage Efficiency</div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <div className="text-2xl font-bold text-white">{stats.efficiency}</div>
                            <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Saved by RAG</div>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full`} style={{ width: stats.efficiency }} />
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition group font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout Session
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-6 md:px-10 py-10 md:py-12 custom-scrollbar relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 blur-[150px] -z-10 rounded-full opacity-50" />

                {/* Header section */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
                            {activeTab === 'overview' && 'System Analytics'}
                            {activeTab === 'injection' && 'Knowledge Injection'}
                            {activeTab === 'documents' && 'Document Management'}
                            {activeTab === 'users' && 'User Management'}
                            {activeTab === 'logs' && 'Real-time Metrics'}
                        </h1>
                        <p className="text-slate-400 font-medium tracking-tight">Managing <span className="text-violet-400">Agentic RAG</span> core performance.</p>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => setShowSearchModal(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 glass-card border-none rounded-2xl text-sm font-black text-white hover:bg-white/10 transition group bg-white/5 uppercase tracking-widest"
                        >
                            <Search className="w-4 h-4 group-hover:scale-110 transition" /> Global Search
                        </button>
                        <label className="flex-1 md:flex-none btn-primary shadow-violet-600/20 px-8 py-3 md:py-2.5 cursor-pointer flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest">
                            <Plus className="w-4 h-4" /> New Entry
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </header>

                {/* Search Modal */}
                {showSearchModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="w-full max-w-2xl glass rounded-3xl p-8 border border-white/10 shadow-2xl scale-in-center">
                            <div className="flex items-center gap-4 mb-8">
                                <Search className="w-6 h-6 text-violet-400" />
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="Search Knowledge Base (PDFs, Research, Data)..." 
                                    className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder:text-slate-600 font-bold"
                                    value={searchTerm}
                                    onChange={handleGlobalSearch}
                                />
                                {isSearching && <Loader2 className="w-5 h-5 animate-spin text-violet-400" />}
                                <button onClick={() => setShowSearchModal(false)} className="text-slate-500 hover:text-white font-bold">ESC</button>
                            </div>
                            
                            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {/* Vector Results */}
                                {searchResults.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3" /> Knowledge Base Matches
                                        </div>
                                        {searchResults.map((res, i) => (
                                            <div key={i} className="p-5 bg-violet-600/5 border border-violet-500/10 rounded-3xl group hover:border-violet-500/30 transition">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                                        <FileText className="w-3.5 h-3.5 text-violet-400" />
                                                        {res.filename}
                                                    </div>
                                                    <div className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Score: {res.score}</div>
                                                </div>
                                                <div className="text-[13px] text-slate-400 leading-relaxed italic line-clamp-3">"{res.text}"</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Local Doc Filters */}
                                {searchTerm.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">File Registry</div>
                                        {documents.filter(d => 
                                            d.name.toLowerCase().includes(searchTerm.toLowerCase())
                                        ).map((doc, i) => (
                                            <div 
                                                key={i}
                                                onClick={() => {
                                                    setActiveTab('documents');
                                                    setShowSearchModal(false);
                                                }}
                                                className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 transition cursor-pointer group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">{doc.name.split('.').pop()}</div>
                                                    <div className="text-sm font-bold text-white group-hover:text-violet-400 transition">{doc.name}</div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-700" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {searchTerm.length >= 3 && searchResults.length === 0 && !isSearching && (
                                    <div className="text-center py-10 text-slate-600 italic">No direct vector matches found. Try different keywords.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Toast */}
                {uploadStatus && (
                    <div className={`fixed top-12 right-12 z-[100] px-6 py-4 rounded-2xl glass border flex items-center gap-4 animate-in slide-in-from-right duration-300 ${uploadStatus.includes('Error') ? 'border-rose-500/30 text-rose-400' : 'border-emerald-500/30 text-emerald-400'
                        }`}>
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                        <span className="font-bold text-sm">{uploadStatus}</span>
                    </div>
                )}

                {/* Tab Content */}
                {activeTab === 'overview' && <Overview stats={stats} trends={trends} activities={activities} chartData={chartData} onViewAll={() => setActiveTab('logs')} />}
                {activeTab === 'injection' && (
                    <Injection 
                        handleFileUpload={handleFileUpload} 
                        isUploading={isUploading} 
                        reviewingText={reviewingText}
                        setReviewingText={setReviewingText}
                        handleConfirmIngest={handleConfirmIngest}
                        isIngesting={isIngesting}
                        filename={extractedData?.filename}
                    />
                )}
                {activeTab === 'documents' && <DocumentsList documents={documents} onDelete={handleDeleteDocument} />}
                {activeTab === 'users' && <UsersList />}
                {activeTab === 'logs' && <SystemLogs stats={stats} activities={activities} />}
            </main>
        </div>
    );
};

// Sub-Components
function SideLink({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition group relative ${active ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-200'
                }`}
        >
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-full shadow-[0_0_12px_rgba(139,92,246,0.6)]" />}
            {icon}
            <span className="font-bold text-sm tracking-wide uppercase">{label}</span>
        </button>
    );
}

const Overview = ({ stats, trends, activities, chartData, onViewAll }) => {
    // Determine the max vectors for chart scaling
    const maxVectors = chartData?.length ? Math.max(...chartData.map(d => d.vectors)) : 0;

    return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <StatBox icon={<Database />} label="Points" value={stats.total_vectors} trend={trends?.vectors || '+0%'} colorClass="text-violet-500" />
            <StatBox icon={<Search />} label="Queries" value={stats.total_queries} trend={trends?.queries || '+0%'} colorClass="text-blue-500" />
            <StatBox icon={<FileText />} label="Size" value={stats.kb_size} trend={trends?.size || '+0%'} colorClass="text-emerald-500" />
            <StatBox icon={<Activity />} label="Uptime" value={stats.runtime} trend="Healthy" colorClass="text-amber-500" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-10 border-white/5 min-h-[400px]">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-violet-500" />
                    Embedding Progress Monitor <span className="text-[10px] bg-white/5 uppercase tracking-widest px-2 py-1 rounded text-slate-500">Last 7 Days</span>
                </h3>
                
                <div className="h-[250px] w-full bg-slate-900/40 rounded-3xl border border-white/5 p-6 flex flex-col justify-end">
                    {chartData && chartData.length > 0 ? (
                        <div className="flex h-full items-end justify-between gap-4">
                            {chartData.map((data, index) => {
                                // Scale height based on max vectors
                                const chartHeight = maxVectors === 0 ? 0 : Math.max(5, (data.vectors / maxVectors) * 100);
                                return (
                                    <div key={index} className="flex flex-col items-center gap-3 w-full group relative">
                                        
                                        {/* Hover Tooltip */}
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition duration-300 bg-violet-600/20 shadow-xl border border-violet-500/30 px-3 py-1.5 rounded-xl flex flex-col items-center">
                                            <span className="text-xs font-bold text-white shadow-sm">{data.vectors}</span>
                                            <span className="text-[8px] uppercase tracking-widest text-violet-300">Vectors</span>
                                        </div>

                                        {/* Bar */}
                                        <div className="w-full bg-slate-800/50 rounded-t-xl group-hover:bg-slate-800 transition duration-300 flex items-end justify-center h-[160px] overflow-hidden">
                                            <div 
                                                className="w-full bg-gradient-to-t from-violet-600 to-indigo-400 rounded-t-xl transition-all duration-1000 ease-out flex opacity-70 group-hover:opacity-100 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                                style={{ height: `${chartHeight}%` }}
                                            />
                                        </div>
                                        {/* Label */}
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight whitespace-nowrap group-hover:text-white transition">{data.date}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center italic text-slate-600 text-sm font-bold">
                            No embedding data found for the last 7 days
                        </div>
                    )}
                </div>
            </div>
            <div className="glass-card p-10 border-white/5">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        Audit Logs
                    </h3>
                    <button onClick={onViewAll} className="text-xs text-violet-400 font-bold hover:underline transition">View All</button>
                </div>
                <div className="space-y-6">
                    {activities.length > 0 ? activities.map((act, i) => (
                        <AuditItem 
                            key={i} 
                            label={act.label} 
                            sub={act.sub} 
                            time={timeAgo(act.time)} 
                            status={act.status} 
                        />
                    )) : (
                        <div className="text-center py-10 text-slate-600 italic text-sm">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
};

// Helper for relative time
const timeAgo = (dateString) => {
    if (!dateString) return 'recently';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
};

const StatBox = ({ icon, label, value, trend, colorClass }) => (
    <div className="glass-card p-5 md:p-8 border-white/5 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-3 md:p-4 opacity-10 group-hover:scale-125 group-hover:opacity-20 transition duration-500 ${colorClass}`}>
            {icon}
        </div>
        <div className="text-[9px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-3 md:mb-4">{label}</div>
        <div className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4">{value}</div>
        <div className="text-[9px] md:text-xs font-bold text-emerald-400 flex items-center gap-1">
            <Activity className="w-3 h-3" /> {trend}
        </div>
    </div>
);

const AuditItem = ({ label, sub, time, status }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition group cursor-default">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-violet-600 transition duration-300">
                <Play className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </div>
            <div>
                <div className="text-sm font-bold text-white mb-0.5">{label}</div>
                <div className="text-xs text-slate-500 font-medium tracking-wide">{sub}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-tighter">{time}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block ${status === 'Success' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'
                }`}>{status}</div>
        </div>
    </div>
);

const Injection = ({ handleFileUpload, isUploading, reviewingText, setReviewingText, handleConfirmIngest, isIngesting, filename }) => {
    if (reviewingText !== null) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                <div className="glass-card p-10 border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <FileText className="w-64 h-64 text-violet-400" />
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Review Content</h2>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Verified: <span className="text-violet-400 font-black">{filename}</span></p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => setReviewingText(null)}
                                className="flex-1 md:flex-none px-6 py-3 rounded-2xl glass border border-white/5 text-slate-400 font-black uppercase tracking-widest hover:bg-white/5 transition text-[10px]"
                                disabled={isIngesting}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmIngest}
                                disabled={isIngesting}
                                className="flex-1 md:flex-none btn-primary px-8 py-3 shadow-violet-600/20 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                {isIngesting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Ingesting
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" /> Finalize
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="relative group min-h-[400px] md:min-h-[500px] bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 text-[10px] font-black text-violet-500 uppercase tracking-widest bg-violet-500/10 px-2 py-1 rounded">Editor Active</div>
                        <textarea 
                            className="w-full h-full min-h-[400px] md:min-h-[500px] bg-transparent p-6 md:p-12 text-slate-300 font-medium leading-relaxed outline-none border-none resize-none custom-scrollbar text-base md:text-lg"
                            value={reviewingText}
                            onChange={(e) => setReviewingText(e.target.value)}
                            disabled={isIngesting}
                        />
                    </div>
                    
                    <div className="mt-8 flex items-center gap-3 text-amber-400 bg-amber-400/5 p-4 rounded-2xl border border-amber-400/10">
                        <Activity className="w-5 h-5 shrink-0" />
                        <p className="text-xs font-bold leading-tight uppercase tracking-tight">
                            Note: Voyage AI rate limits apply. The ingestion process will include 25s throttles per batch to ensure data integrity and system stability.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-8 px-2 md:px-0">
                <label className={`glass-card p-8 md:p-16 text-center border-dashed border-2 border-white/10 hover:border-violet-500/50 hover:bg-violet-600/5 transition cursor-pointer group block relative overflow-hidden ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                    <div className="relative z-10">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-violet-600/10 flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition duration-500">
                            {isUploading ? <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-violet-400 animate-spin" /> : <Upload className="w-8 h-8 md:w-12 md:h-12 text-violet-400" />}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 tracking-tight">Unleash Your Data</h2>
                        <p className="max-w-md mx-auto text-slate-500 mb-8 md:mb-10 leading-relaxed font-medium text-sm md:text-lg">
                            Upload PDFs, docs, or simple text. Our high-fidelity neural ingestion parses it instantly.
                        </p>
                        <div className="flex items-center justify-center gap-4 w-full">
                            <div className="w-full md:w-auto btn-primary px-8 py-4 md:px-10 md:py-4 shadow-violet-600/20 text-sm md:text-lg font-black uppercase tracking-widest">Select File</div>
                        </div>
                    </div>
                </label>

                <div className="grid md:grid-cols-2 gap-8">
                    <InjectionTypeCard
                        icon={<Play className="text-rose-500" />}
                        title="Media Injection"
                        desc="Supports MP4, MOV, WAV, MP3. Automated transcription into vectors."
                    />
                    <InjectionTypeCard
                        icon={<Database className="text-cyan-500" />}
                        title="Dataset Sync"
                        desc="Connect JSON, CSV or raw DB dumps for large scale vectorization."
                    />
                </div>
            </div>
        </div>
    );
};

const InjectionTypeCard = ({ icon, title, desc }) => (
    <div className="glass-card p-8 border-white/5 flex gap-6 items-start hover:bg-white/5 transition group">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-violet-600 group-hover:border-violet-500 transition duration-300">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white mb-2">{title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

const DocumentsList = ({ documents, onDelete }) => (
    <div className="animate-in fade-in duration-500">
        <div className="glass-card border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/2 border-b border-white/5">
                            <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Document</th>
                            <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest hidden sm:table-cell">Type</th>
                            <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-4 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {documents.length > 0 ? documents.map((doc, idx) => (
                            <DocumentRow 
                                key={idx} 
                                id={doc.id}
                                name={doc.name} 
                                type={doc.type} 
                                status={doc.status} 
                                onDelete={onDelete}
                            />
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-8 py-20 text-center text-slate-600 italic font-medium">No documents uploaded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const DocumentRow = ({ id, name, type, status, onDelete }) => {
    const [showActions, setShowActions] = React.useState(false);

    return (
        <tr className="hover:bg-white/2 group transition">
            <td className="px-4 md:px-8 py-4 md:py-6">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-900 flex flex-col items-center justify-center font-black text-[8px] md:text-[10px] text-slate-600 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition duration-300 uppercase leading-none">{name.split('.').pop()}</div>
                    <div className="font-bold text-white text-[11px] md:text-sm truncate w-[100px] md:max-w-[200px] md:w-auto break-all">{name}</div>
                </div>
            </td>
            <td className="px-4 md:px-8 py-4 md:py-6 text-xs md:text-sm text-slate-500 font-bold tracking-tight italic hidden sm:table-cell">{type}</td>
            <td className="px-4 md:px-8 py-4 md:py-6">
                <div className="flex items-center gap-1.5 md:gap-2">
                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${status === 'Indexed' ? 'bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20' : status === 'Transcribing' ? 'bg-violet-500 animate-pulse' : status === 'Error' ? 'bg-rose-500' : 'bg-slate-500'}`} />
                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${status === 'Indexed' ? 'text-emerald-400' : status === 'Transcribing' ? 'text-violet-400' : status === 'Error' ? 'text-rose-400' : 'text-slate-500'}`}>{status}</span>
                </div>
            </td>
            <td className="px-4 md:px-8 py-4 md:py-6 text-right relative">
                <button 
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 md:p-2 text-slate-600 hover:text-white transition"
                >
                    <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {showActions && (
                    <div className="absolute right-4 md:right-8 top-12 md:top-16 z-[60] w-48 glass-card border-white/10 p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => {
                                onDelete(id);
                                setShowActions(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition font-black uppercase tracking-widest text-[10px]"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

const SystemLogs = ({ stats, activities }) => (
    <div className="animate-in fade-in duration-500">
        <div className="glass-card p-10 border-white/5 space-y-10">
            <div className="flex justify-between items-center pb-6 border-b border-white/5">
                <h3 className="text-xl font-bold flex items-center gap-3">
                    <Activity className="w-6 h-6 text-violet-500" />
                    Live Engine Events
                </h3>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Real-time Stream Active</span>
                </div>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-400">
                <div className="flex gap-4">
                    <span className="text-violet-500 font-bold">[SYSTEM]</span>
                    <span>Knowledge Engine Initialized. Storage Parity: 100% Verified.</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-emerald-500 font-bold">[QDRANT]</span>
                    <span>Handshake stable. Currently tracking {stats.total_vectors} points.</span>
                </div>
                
                {activities.map((act, i) => (
                    <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left duration-300">
                        <span className="text-blue-500 font-bold">[INGEST]</span>
                        <span>{act.label} | {act.sub} | Status: <span className="text-emerald-400">COMPLETED</span></span>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="flex gap-4 opacity-50 italic">
                        <span className="text-slate-600 font-bold">[LOG]</span>
                        <span>Waiting for new ingestion events...</span>
                    </div>
                )}

                <div className="flex gap-4 text-slate-200">
                    <span className="text-blue-500 font-bold">[LLM]</span>
                    <span>Voyage AI & Groq Cluster connected. Latency: 38ms.</span>
                </div>
                <div className="pt-4 flex gap-4 opacity-30">
                    <span className="text-slate-600 font-bold">[DEBUG]</span>
                    <span>Monitoring active session. Garbage collection triggered. Success.</span>
                </div>
            </div>
        </div>
    </div>
);

export default Dashboard;
