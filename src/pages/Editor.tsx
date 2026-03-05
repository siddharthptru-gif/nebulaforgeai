import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db, storage } from '../firebase';
import { ref, get, update } from 'firebase/database';
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { 
  ChevronLeft, 
  Save, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Undo, 
  Redo, 
  Plus, 
  Settings, 
  Sparkles, 
  Loader2,
  Type,
  Palette,
  Image as ImageIcon,
  Layers,
  Code,
  Layout,
  Shield,
  Rocket
} from 'lucide-react';
import { cn } from '../utils';

export default function Editor() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'pages' | 'theme' | 'sections' | 'ai'>('pages');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const projectRef = ref(db, `projects/${projectId}`);
      const snapshot = await get(projectRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (!data.content || Object.keys(data.content).length === 0) {
          generateInitialContent(data.prompt);
        } else {
          setProject({ id: projectId, ...data });
          setLoading(false);
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/dashboard');
    }
  };

  const generateInitialContent = async (prompt: string) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, theme: 'modern' }),
      });
      const content = await response.json();
      
      await update(ref(db, `projects/${projectId}`), { content });
      setProject({ id: projectId, prompt, content });
      setLoading(false);
    } catch (error) {
      console.error('Error generating initial content:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update(ref(db, `projects/${projectId}`), { content: project.content });
    } catch (error) {
      console.error('Error saving:', error);
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const currentPage = project.content.pages[currentPageIndex];
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${currentPage.seo?.title || 'NebulaForge Site'}</title>
            <meta name="description" content="${currentPage.seo?.description || ''}">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Inter', sans-serif; }
            </style>
          </head>
          <body>
            ${currentPage.html}
          </body>
        </html>
      `;

      // Upload to Firebase Storage
      const siteRef = storageRef(storage, `published/${projectId}/index.html`);
      await uploadString(siteRef, fullHtml, 'raw', { contentType: 'text/html' });
      const publicUrl = await getDownloadURL(siteRef);

      // Update Realtime Database
      await update(ref(db, `projects/${projectId}`), { 
        publishUrl: publicUrl,
        isPublished: true 
      });

      await update(ref(db, `publishedSites/${projectId}`), {
        url: publicUrl,
        publishedAt: Date.now()
      });

      window.open(publicUrl, '_blank');
    } catch (error) {
      console.error('Error publishing:', error);
    }
    setPublishing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-white/60 font-medium">NebulaForge is crafting your masterpiece...</p>
      </div>
    );
  }

  const currentPage = project.content.pages[currentPageIndex];

  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <h1 className="font-bold text-sm tracking-tight">{project.name}</h1>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Draft</span>
        </div>

        <div className="flex items-center gap-2 bg-zinc-800/50 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setViewMode('desktop')}
            className={cn("p-2 rounded-lg transition-all", viewMode === 'desktop' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('tablet')}
            className={cn("p-2 rounded-lg transition-all", viewMode === 'tablet' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={cn("p-2 rounded-lg transition-all", viewMode === 'mobile' ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-white/40 hover:text-white transition-all">
            <Undo className="w-5 h-5" />
          </button>
          <button className="p-2 text-white/40 hover:text-white transition-all">
            <Redo className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </button>
          <button 
            onClick={handlePublish}
            disabled={publishing}
            className="px-4 py-2 bg-emerald-500 text-black rounded-lg text-sm font-bold hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-white/5 bg-zinc-900/30 flex flex-col">
          <div className="flex border-b border-white/5">
            {[
              { id: 'pages', icon: Layers },
              { id: 'theme', icon: Palette },
              { id: 'sections', icon: Plus },
              { id: 'ai', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 py-4 flex items-center justify-center transition-all border-b-2",
                  activeTab === tab.id ? "border-emerald-500 text-emerald-500 bg-emerald-500/5" : "border-transparent text-white/40 hover:text-white"
                )}
              >
                <tab.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'pages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Pages</h3>
                  <button className="p-1 hover:bg-white/5 rounded text-emerald-500">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {project.content.pages.map((page: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPageIndex(i)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between group",
                      currentPageIndex === i ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "hover:bg-white/5 text-white/60"
                    )}
                  >
                    <span>{page.name}</span>
                    <Settings className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(project.content.theme.colors).map(([key, value]: [string, any]) => (
                      <div key={key}>
                        <label className="block text-[10px] text-white/40 uppercase mb-2">{key}</label>
                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                          <div className="w-6 h-6 rounded border border-white/10" style={{ backgroundColor: value }} />
                          <span className="text-[10px] font-mono">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Typography</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase mb-2">Heading Font</label>
                      <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm">
                        <option>Inter</option>
                        <option>Space Grotesk</option>
                        <option>Playfair Display</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Power Tools</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Advanced AI modules to supercharge your website.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: Sparkles, label: "Page Redesign", color: "text-emerald-400" },
                    { icon: Type, label: "Content Writer", color: "text-blue-400" },
                    { icon: Globe, label: "SEO Optimizer", color: "text-purple-400" },
                    { icon: Palette, label: "Theme Generator", color: "text-pink-400" },
                    { icon: Layout, label: "Section Generator", color: "text-orange-400" },
                    { icon: Shield, label: "Privacy Policy Gen", color: "text-cyan-400" },
                    { icon: Rocket, label: "Speed Optimizer", color: "text-yellow-400" },
                    { icon: Monitor, label: "Mobile Optimizer", color: "text-indigo-400" }
                  ].map((tool, i) => (
                    <button key={i} className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-sm transition-all flex items-center gap-3 group">
                      <tool.icon className={cn("w-4 h-4", tool.color)} />
                      <span className="flex-1">{tool.label}</span>
                      <ChevronLeft className="w-3 h-3 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              <Code className="w-4 h-4" />
              Edit HTML
            </button>
          </div>
        </aside>

        {/* Preview Area */}
        <main className="flex-1 bg-zinc-950 p-8 flex items-center justify-center overflow-hidden">
          <div 
            className={cn(
              "bg-white rounded-2xl shadow-2xl transition-all duration-500 overflow-hidden",
              viewMode === 'desktop' ? "w-full h-full" : 
              viewMode === 'tablet' ? "w-[768px] h-[1024px] max-h-full" : 
              "w-[375px] h-[667px] max-h-full"
            )}
          >
            <iframe 
              ref={iframeRef}
              className="w-full h-full border-none"
              title="Preview"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                    <style>
                      body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
                      * { transition: all 0.2s ease; }
                    </style>
                  </head>
                  <body>
                    ${currentPage.html}
                  </body>
                </html>
              `}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
