import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket, Zap, Globe, Palette, Layout, Shield, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    if (user) {
      // If logged in, go to dashboard with prompt or handle creation
      navigate('/dashboard', { state: { initialPrompt: prompt } });
    } else {
      // If not logged in, go to signup
      navigate('/signup', { state: { initialPrompt: prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Sparkles className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">NebulaForge AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-emerald-400 transition-colors">Login</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-emerald-400 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 inline-block">
              The Future of Web Design
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
              Design, Build, and Launch <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Websites with AI
              </span> in Seconds.
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
              NebulaForge AI transforms your ideas into professional, high-performance websites instantly. No code, no limits, just pure creativity.
            </p>

            <form onSubmit={handleGenerate} className="max-w-2xl mx-auto mb-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col sm:flex-row gap-2 p-2 bg-zinc-900 border border-white/10 rounded-2xl">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your dream website..."
                  className="flex-1 px-6 py-4 bg-transparent border-none focus:outline-none text-white text-lg"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-emerald-500 text-black rounded-xl text-lg font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-black rounded-full text-lg font-bold hover:bg-emerald-400 hover:scale-105 transition-all flex items-center justify-center gap-2">
                Start Building Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-lg font-bold hover:bg-white/10 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Preview Image */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 max-w-6xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-2xl shadow-emerald-500/10"
        >
          <img 
            src="https://picsum.photos/seed/nebula/1200/800" 
            alt="NebulaForge Editor Preview" 
            className="rounded-xl w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-white/60">Powerful AI tools to help you build better, faster.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Instant Generation", desc: "Generate full multi-page websites in under 5 seconds with our advanced AI engine." },
              { icon: Layout, title: "Visual Editor", desc: "A powerful drag-and-drop editor that gives you full control over every pixel." },
              { icon: Globe, title: "One-Click Publish", desc: "Deploy your site to a global CDN instantly with a custom domain or our subdomain." },
              { icon: Palette, title: "AI Themes", desc: "Automatically generate color palettes and font pairings that match your brand." },
              { icon: Shield, title: "SEO Optimized", desc: "AI-generated meta tags, sitemaps, and structured data for maximum visibility." },
              { icon: Rocket, title: "Performance First", desc: "Websites optimized for speed, accessibility, and mobile responsiveness." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500 w-6 h-6" />
            <span className="text-xl font-bold">NebulaForge AI</span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
          <p className="text-sm text-white/40">© 2026 NebulaForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
