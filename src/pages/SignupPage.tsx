import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create initial usage record in Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        plan: 'free',
        generationsCount: 0,
        createdAt: Date.now()
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Sparkles className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NebulaForge AI</span>
          </Link>
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-white/60 mt-2">Start building your next big thing today.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <p className="text-center mt-8 text-white/40 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-medium hover:text-emerald-400">Log in</Link>
        </p>
      </div>
    </div>
  );
}
