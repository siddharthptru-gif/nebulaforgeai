import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { db } from '../firebase';
import { ref, get, push, remove, set } from 'firebase/database';
import { 
  Plus, 
  Layout, 
  Globe, 
  Settings, 
  LogOut, 
  Sparkles, 
  MoreVertical, 
  ExternalLink, 
  Trash2,
  Loader2
} from 'lucide-react';
import { formatDate } from '../utils';
import Analytics from '../components/Analytics';

interface Project {
  id: string;
  name: string;
  publishUrl?: string;
  isPublished?: boolean;
  createdAt: number;
  prompt: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const projectsRef = ref(db, 'projects');
      const snapshot = await get(projectsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projectList = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val }))
          .filter(p => p.userId === user?.uid)
          .sort((a, b) => b.createdAt - a.createdAt);
        setProjects(projectList);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !user) return;
    setCreating(true);

    try {
      const projectsRef = ref(db, 'projects');
      const newProjectRef = push(projectsRef);
      const projectId = newProjectRef.key;

      await set(newProjectRef, {
        userId: user.uid,
        name: prompt.slice(0, 20) + '...',
        prompt: prompt,
        content: {},
        createdAt: Date.now()
      });

      navigate(`/editor/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      setCreating(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await remove(ref(db, `projects/${id}`));
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <Sparkles className="text-emerald-500 w-6 h-6" />
            <span className="font-bold">NebulaForge</span>
          </Link>
          
          <nav className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl font-medium">
              <Layout className="w-5 h-5" />
              My Websites
            </Link>
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
              <Globe className="w-5 h-5" />
              Published
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-all">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-white/40">Free Plan</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-400/10 rounded-xl font-medium transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
            <div className="lg:col-span-2">
              <Analytics />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Usage Stats</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">AI Generations</span>
                    <span className="font-bold">3 / 5</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[60%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Published Sites</span>
                    <span className="font-bold">1 / 1</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-full" />
                  </div>
                </div>
                <Link to="/settings" className="block w-full py-3 bg-white text-black rounded-xl text-sm font-bold text-center hover:bg-emerald-400 transition-all mt-4">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Websites</h1>
              <p className="text-white/40">Manage and edit your AI-generated projects.</p>
            </div>
            <button 
              onClick={() => document.getElementById('create-modal')?.classList.remove('hidden')}
              className="px-6 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Layout className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-xl font-bold mb-2">No websites yet</h3>
              <p className="text-white/40 mb-8">Start by creating your first AI-generated website.</p>
              <button 
                onClick={() => document.getElementById('create-modal')?.classList.remove('hidden')}
                className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-emerald-400 transition-all"
              >
                Create Website
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all">
                  <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${project.id}/400/225`} 
                      alt={project.name}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                      <Link to={`/editor/${project.id}`} className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-all">
                        Open Editor
                      </Link>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold truncate pr-4">{project.name}</h3>
                      <button className="p-1 hover:bg-white/10 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span>Created {formatDate(new Date(project.createdAt).toISOString())}</span>
                      {project.isPublished && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Globe className="w-3 h-3" />
                          Published
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {project.isPublished && (
                        <a 
                          href={project.publishUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2 transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Site
                        </a>
                      )}
                      <button 
                        onClick={() => deleteProject(project.id)}
                        className="p-2 hover:bg-red-400/10 hover:text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      <div id="create-modal" className="hidden fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Create New Website</h2>
            <button 
              onClick={() => document.getElementById('create-modal')?.classList.add('hidden')}
              className="p-2 hover:bg-white/5 rounded-xl transition-all"
            >
              <Plus className="w-6 h-6 rotate-45" />
            </button>
          </div>

          <form onSubmit={handleCreateProject}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/60 mb-3">What kind of website do you want to build?</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A modern AI SaaS landing page with hero section, features grid, testimonials, pricing table and contact form."
                className="w-full h-40 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {['Modern', 'Startup', 'Minimal'].map((theme) => (
                <button 
                  key={theme}
                  type="button"
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500 transition-all text-sm font-medium"
                >
                  {theme}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              disabled={creating}
              className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {creating ? 'Generating Website...' : 'Generate with AI'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
