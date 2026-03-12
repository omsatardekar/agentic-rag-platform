import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

const ChatInput = ({ onSend, disabled, isCentered }) => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const textRef = useRef('');

    const updateText = (newVal) => {
        setText(newVal);
        textRef.current = newVal;
    };

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition;
            const myRecognition = new SpeechRecognition();
            myRecognition.continuous = false;
            myRecognition.interimResults = true;
            myRecognition.lang = 'en-US';

            myRecognition.onstart = () => setIsListening(true);
            
            myRecognition.onend = () => {
                setIsListening(false);
                // Auto-submit when user stops speaking (like ChatGPT Voice)
                if (textRef.current.trim() && !disabled) {
                    onSend(textRef.current, true); // Pass true to flag as voice interaction
                    updateText('');
                }
            };

            myRecognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                if (finalTranscript) {
                    const newText = textRef.current ? textRef.current + ' ' + finalTranscript : finalTranscript;
                    updateText(newText);
                }
            };
            
            myRecognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            setRecognition(myRecognition);
        }
    }, [disabled, onSend]);

    const toggleListening = () => {
        if (!recognition) {
            alert("Speech recognition isn't supported in your browser. Please try Chrome.");
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            promptAndStart();
        }
    };

    const promptAndStart = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            recognition.start();
        } catch (err) {
            console.error(err);
            alert("Microphone access denied. Please allow microphone access to use voice typing.");
        }
    }

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (textRef.current.trim() && !disabled) {
            if (isListening) {
                // This triggers recognition.stop() which triggers onend which auto-submits, but safely:
                recognition?.stop();
            } else {
                onSend(textRef.current, false);
                updateText('');
            }
        }
    };

    return (
        <div className={`w-full ${isCentered ? 'max-w-2xl px-6 mx-auto' : 'max-w-4xl px-6 mx-auto'}`}>
            <div className="relative group/input">
                <form onSubmit={handleSubmit} className="relative">
                    {/* Focus Glow */}
                    <div className={`absolute -inset-1 rounded-[28px] blur-xl opacity-0 transition duration-500 pointer-events-none ${isListening ? 'bg-rose-600/20 opacity-100' : 'bg-violet-600/10 group-focus-within/input:opacity-100'}`} />

                    <div className={`relative bg-slate-900 border overflow-hidden shadow-2xl backdrop-blur-3xl transition duration-300 rounded-[28px] ${isListening ? 'border-rose-500/50' : 'border-white/10 group-focus-within/input:border-violet-500/50'}`}>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => updateText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                placeholder={isListening ? "Listening... Speak now" : (disabled ? "Free limit reached. Sign in to continue..." : "Type or speak your query here...")}
                                disabled={disabled}
                                className={`w-full bg-transparent px-7 py-5 text-lg font-medium placeholder-slate-600 focus:outline-none transition-all ${isListening ? 'text-rose-200' : 'text-white'}`}
                            />
                            
                            <div className="flex items-center gap-2 pr-3">
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    disabled={disabled}
                                    className={`p-3.5 rounded-2xl transition-all duration-300 transform w-[48px] h-[48px] flex justify-center items-center ${
                                        isListening
                                        ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
                                        : (disabled ? 'text-slate-700 bg-white/5 cursor-not-allowed scale-95' : 'text-slate-400 bg-white/5 hover:text-white hover:bg-white/10')
                                    }`}
                                    title="Voice Search"
                                >
                                    {isListening ? <MicOff className="w-5 h-5 shrink-0" /> : <Mic className="w-5 h-5 shrink-0" />}
                                </button>

                                <button
                                    type="submit"
                                    disabled={!text.trim() || disabled}
                                    className={`p-3.5 rounded-2xl transition-all duration-300 transform w-[48px] h-[48px] flex justify-center items-center shrink-0 ${text.trim() && !disabled
                                        ? 'bg-violet-600 text-white shadow-xl scale-100 active:scale-90 hover:bg-violet-700'
                                        : 'text-slate-700 bg-white/5 cursor-not-allowed scale-95'
                                        }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInput;
