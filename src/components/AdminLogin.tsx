import React, { useState } from 'react';
import { useMenu } from '../context/MenuContext';
import { ShieldAlert, KeyRound, User, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const { login, setIsAdmin } = useMenu();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Minor delay to simulate secure authorization validation
    setTimeout(() => {
      const success = login(username.trim(), password);
      setIsLoading(false);
      if (!success) {
        setError('Invalid supervisor credentials. Please verify username and passcode.');
      }
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-brand-cream/40" id="admin-login-screen">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl border border-brand-light p-6 sm:p-10 shadow-xs space-y-6"
      >
        {/* Title, Icon and Brand representation */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-brand-primary/10 text-brand-primary">
            <KeyRound className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-black text-brand-dark tracking-tight">
              Management Portal Login
            </h3>
            <p className="text-xs text-brand-muted mt-1 leading-relaxed">
              Authenticate via the secure gateway to update pricing catalog, recipes, and tab categories.
            </p>
          </div>
        </div>



        {/* Error notification banner if login fails */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2 text-left"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Interactive Login Input fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Username Input Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Username Handle</span>
            </label>
            <input
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-dark"
              required
              disabled={isLoading}
              id="login-username-input"
            />
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Security Passcode</span>
            </label>
            <input
              type="password"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-brand-cream border border-brand-light rounded-xl text-xs font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-brand-dark"
              required
              disabled={isLoading}
              id="login-password-input"
            />
          </div>

          {/* Log In submit action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-brand-primary hover:bg-brand-dark disabled:bg-brand-primary/60 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            id="login-submit-button"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Unlock Admin Controls</span>
            )}
          </button>
        </form>

        {/* Back to public customer catalog link */}
        <div className="pt-2 border-t border-brand-light text-center">
          <button
            onClick={() => setIsAdmin(false)}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:text-brand-dark transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back to General Menu</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
