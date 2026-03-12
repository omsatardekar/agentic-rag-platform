import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Twitter, Globe, Linkedin } from 'lucide-react';

const Contact = () => {
    return (
        <div className="pb-32">
            {/* Header */}
            <section className="relative pt-20 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-1/2 translate-x-1/2 w-full h-[600px] bg-violet-600/10 blur-3xl -z-10 rounded-full" />

                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
                        <MessageSquare className="w-4 h-4" />
                        <span>Support & Research Team</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8">
                        Let's Start a <br />
                        <span className="gradient-text">Conversation</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12">
                        Have questions about our API, enterprise solutions, or research? Our team is here to help you scale your AI intelligence.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-6">Contact Details</h2>
                    <ContactInfoCard
                        icon={<Mail className="text-violet-500" />}
                        title="Email"
                        details="hello@agenticrag.ai"
                    />
                    <ContactInfoCard
                        icon={<Phone className="text-blue-500" />}
                        title="Phone"
                        details="+1 (555) 000-0000"
                    />
                    <ContactInfoCard
                        icon={<MapPin className="text-emerald-500" />}
                        title="Headquarters"
                        details="Silicon Valley, San Francisco"
                    />

                    <div className="pt-8 border-t border-white/5 space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Social Support</h3>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} />
                            <SocialIcon icon={<Linkedin className="w-5 h-5" />} />
                            <SocialIcon icon={<Globe className="w-5 h-5" />} />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="glass p-10 rounded-3xl border border-white/10 relative">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-400 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Work Email</label>
                                <input
                                    type="email"
                                    placeholder="john@company.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Subject</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 focus:outline-none focus:border-violet-500 transition-colors">
                                    <option>General Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>Partnership</option>
                                    <option>Billing</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2">Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="How can we help?"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                                />
                            </div>

                            <button className="btn-primary w-full py-4 text-lg">
                                Send Message <Send className="w-5 h-5 ml-2" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

function ContactInfoCard({ icon, title, details }) {
    return (
        <div className="flex gap-4 p-6 glass-card border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-white mb-1">{title}</h3>
                <p className="text-slate-400">{details}</p>
            </div>
        </div>
    );
}

function SocialIcon({ icon }) {
    return (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 cursor-pointer transition text-slate-400 hover:text-white">
            {icon}
        </div>
    );
}

export default Contact;
