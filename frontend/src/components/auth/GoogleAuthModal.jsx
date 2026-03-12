import React, { useState } from 'react';
import { X, User, Shield, ArrowLeft, Loader2 } from 'lucide-react';

const GoogleAuthModal = ({ isOpen, onClose, onSelect }) => {
    const [step, setStep] = useState('list'); // 'list' or 'confirm' or 'loading'
    const [selectedAccount, setSelectedAccount] = useState(null);

    const accounts = [
        { name: 'John Doe', email: 'john.doe@gmail.com', avatar: 'JD' },
        { name: 'John Research', email: 'john.researcher@univ.edu', avatar: 'JR' },
    ];

    if (!isOpen) return null;

    const handleAccountClick = (account) => {
        setSelectedAccount(account);
        setStep('confirm');
    };

    const handleConfirm = () => {
        setStep('loading');
        setTimeout(() => {
            onSelect(selectedAccount);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden text-slate-900 border border-slate-200">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        <span className="font-medium text-slate-700">Sign in with Google</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'list' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Choose an account</h2>
                                <p className="text-slate-500 text-sm font-medium">to continue to Agentic RAG</p>
                            </div>

                            <div className="space-y-1">
                                {accounts.map((acc, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAccountClick(acc)}
                                        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition rounded-xl group border border-transparent hover:border-slate-100"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
                                            {acc.avatar}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-slate-900">{acc.name}</div>
                                            <div className="text-xs text-slate-500 font-medium">{acc.email}</div>
                                        </div>
                                    </button>
                                ))}

                                <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition rounded-xl group border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-200 transition">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="text-left font-bold text-sm text-slate-700">Use another account</div>
                                </button>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed text-center mt-10 px-4">
                                To continue, Google will share your name, email address, language preference, and profile picture with Agentic RAG.
                            </p>
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="text-center animate-in zoom-in-95 duration-300">
                            <button onClick={() => setStep('list')} className="absolute left-6 top-7 p-1 text-slate-400 hover:text-slate-600">
                                <ArrowLeft className="w-4 h-4" />
                            </button>

                            <div className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-xl shadow-violet-200">
                                {selectedAccount.avatar}
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Continue as {selectedAccount.name}?</h2>
                            <p className="text-slate-500 text-sm font-medium mb-10">{selectedAccount.email}</p>

                            <div className="space-y-4">
                                <button
                                    onClick={handleConfirm}
                                    className="w-full py-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-full transition-all shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    Confirm and Sync Identity
                                </button>
                                <button
                                    onClick={() => setStep('list')}
                                    className="text-sm font-bold text-slate-500 hover:text-slate-900 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'loading' && (
                        <div className="py-20 text-center flex flex-col items-center animate-in fade-in">
                            <div className="relative mb-8">
                                <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
                                <div className="absolute inset-0 w-16 h-16 border-4 border-t-violet-600 rounded-full animate-spin" />
                            </div>
                            <p className="text-slate-900 font-bold mb-1">Authenticated Successfully</p>
                            <p className="text-slate-400 text-sm font-medium tracking-tight">Syncing your neural profile...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <a href="#" className="hover:text-slate-600">Help</a>
                    <a href="#" className="hover:text-slate-600">Privacy</a>
                    <a href="#" className="hover:text-slate-600">Terms</a>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuthModal;
