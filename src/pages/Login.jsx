import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/recepcja');
      } else {
        setError(data.error || 'Błąd logowania');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-anthracite flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/5 backdrop-blur-xl p-12 border border-white/10 rounded-sm"
      >
        <div className="text-center mb-12">
          <span className="text-brand-gold uppercase tracking-[0.6em] text-[10px] mb-4 block">Panel Zarządzania</span>
          <h1 className="text-4xl font-serif text-white italic">Recepcja Gala</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">Email</label>
            <div className="flex items-center space-x-3 border-b border-white/10 py-2 focus-within:border-brand-gold transition-colors">
              <Mail size={16} className="text-white/20" />
              <input 
                type="email" required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-white outline-none w-full font-light text-sm"
                placeholder="admin@gala.pl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">Hasło</label>
            <div className="flex items-center space-x-3 border-b border-white/10 py-2 focus-within:border-brand-gold transition-colors">
              <Lock size={16} className="text-white/20" />
              <input 
                type="password" required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white outline-none w-full font-light text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/10 text-red-400 p-4 text-[10px] uppercase tracking-widest flex items-center space-x-2 border border-red-500/20"
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            disabled={loading}
            className="w-full py-4 bg-brand-gold text-brand-anthracite uppercase tracking-[0.4em] text-xs font-bold hover:bg-brand-logo-beige transition-all duration-500 flex items-center justify-center space-x-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <span>Zaloguj się</span>}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] text-white/20 uppercase tracking-[0.3em]">
            System Autoryzacji v2.0 &copy; Apartamenty Gala
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
