import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Twitter, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative pt-24 pb-12 border-t border-white/5 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 blur-3xl -z-10 rounded-full translate-y-1/2 translate-x-1/2" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-violet-600/10 blur-3xl -z-10 rounded-full -translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                {/* Brand */}
                <div className="col-span-1 md:col-span-1">
                    <Link to="/" className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">Agentic<span className="text-violet-400">RAG</span></span>
                    </Link>
                    <p className="text-slate-400 mb-8 leading-relaxed max-w-xs">
                        Empowering the next generation of AI search and cognitive intelligence. Built for professional researchers and modern teams.
                    </p>
                    <div className="flex gap-4">
                        <SocialLink icon={<Twitter className="w-5 h-5" />} href="#" />
                        <SocialLink icon={<Github className="w-5 h-5" />} href="#" />
                        <SocialLink icon={<Linkedin className="w-5 h-5" />} href="#" />
                        <SocialLink icon={<Mail className="w-5 h-5" />} href="#" />
                    </div>
                </div>

                {/* Links */}
                <FooterColumn title="Product">
                    <FooterLink to="/features" text="Features" />
                    <FooterLink to="/demo" text="Watch Demo" />
                    <FooterLink to="/docs" text="Documentation" highlight />
                    <FooterLink to="/roadmap" text="Roadmap" />
                </FooterColumn>

                <FooterColumn title="Company">
                    <FooterLink to="/about" text="About Us" />
                    <FooterLink to="/careers" text="Careers" />
                    <FooterLink to="/blog" text="Blog" />
                    <FooterLink to="/legal" text="Privacy Policy" />
                </FooterColumn>

                <FooterColumn title="Support">
                    <FooterLink to="/contact" text="Help Center" />
                    <FooterLink to="/faq" text="FAQ" />
                    <FooterLink to="/status" text="System Status" />
                    <FooterLink to="/security" text="Security" />
                </FooterColumn>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 font-medium">
                <div>© 2026 Agentic RAG. All rights reserved.</div>
                <div className="flex items-center gap-6">
                    <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
                    <Link to="/cookies" className="hover:text-white transition">Cookie Settings</Link>
                    <button
                        className="flex items-center gap-1 hover:text-white transition group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        Back to Top <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

function FooterColumn({ title, children }) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100">{title}</h3>
            <ul className="space-y-3">{children}</ul>
        </div>
    );
}

function FooterLink({ to, text, highlight = false }) {
    return (
        <li>
            <Link
                to={to}
                className={`text-slate-400 hover:text-white transition duration-200 text-sm font-medium ${highlight ? 'text-violet-400' : ''
                    }`}
            >
                {text}
            </Link>
        </li>
    );
}

function SocialLink({ icon, href }) {
    return (
        <a
            href={href}
            className="p-2.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-400 hover:text-white transition"
        >
            {icon}
        </a>
    );
}

export default Footer;
