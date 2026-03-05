import React from 'react';
import { useAuth } from '../components/AuthProvider';
import { Link } from 'react-router-dom';
import { ChevronLeft, User, Shield, CreditCard, Bell, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-all">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold">Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <aside className="space-y-1">
            <button className="w-full px-4 py-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl font-medium text-left flex items-center gap-3">
              <User className="w-5 h-5" />
              Profile
            </button>
            <button className="w-full px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium text-left flex items-center gap-3 transition-all">
              <Shield className="w-5 h-5" />
              Security
            </button>
            <button className="w-full px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium text-left flex items-center gap-3 transition-all">
              <CreditCard className="w-5 h-5" />
              Billing
            </button>
            <button className="w-full px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-xl font-medium text-left flex items-center gap-3 transition-all">
              <Bell className="w-5 h-5" />
              Notifications
            </button>
          </aside>

          <div className="md:col-span-3 space-y-10">
            <section>
              <h2 className="text-xl font-bold mb-6">Profile Information</h2>
              <div className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-3xl font-bold text-black">
                    {(user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-emerald-400 transition-all">
                      Change Avatar
                    </button>
                    <p className="text-xs text-white/40 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Display Name</label>
                    <input 
                      type="text" 
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6">Subscription Plan</h2>
              <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 rounded-3xl p-8 flex items-center justify-between">
                <div>
                  <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 inline-block">
                    Current Plan
                  </span>
                  <h3 className="text-2xl font-bold mb-2">Free Explorer</h3>
                  <p className="text-white/60">5 AI generations per day • 1 published site</p>
                </div>
                <button className="px-8 py-4 bg-emerald-500 text-black rounded-full font-bold hover:bg-emerald-400 transition-all">
                  Upgrade to Pro
                </button>
              </div>
            </section>

            <section className="pt-10 border-t border-white/5">
              <button 
                onClick={() => signOut()}
                className="flex items-center gap-2 text-red-400 font-bold hover:text-red-300 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out of All Sessions
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
