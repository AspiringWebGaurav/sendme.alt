'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, GoogleAuthProvider, signInWithPopup } from '@/services/firebase';
import { Shield, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ADMIN_EMAIL = 'gauravpatil9262@gmail.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === ADMIN_EMAIL) {
        router.push('/admin/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        login_hint: ADMIN_EMAIL
      });
      
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email !== ADMIN_EMAIL) {
        await auth.signOut();
        setError('Access Denied: You do not have administrative privileges.');
        setIsLoading(false);
        return;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to authenticate');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center overflow-hidden font-mono selection:bg-primary/30">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-[#050505] to-[#050505]"></div>
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0], 
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 50, 0], 
            y: [0, 50, -100, 0],
            scale: [1, 1.5, 0.9, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, -100, 0], 
            y: [0, 100, -50, 0],
            scale: [1, 1.1, 1.3, 1] 
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]"
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center justify-center w-full px-4 max-w-4xl mx-auto flex-1">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center w-full"
        >
          {/* Logo / Shield */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-24 h-24 mb-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]"
          >
            <Shield className="w-10 h-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            SYSTEM CONSOLE
          </h1>
          <p className="text-lg text-white/50 max-w-lg mx-auto mb-16 font-medium tracking-wide">
            Restricted administrative access zone. Please authenticate your identity to proceed.
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 w-full max-w-md bg-red-950/40 backdrop-blur-md border border-red-500/30 text-red-200 text-sm p-4 rounded-xl flex items-start gap-3 shadow-[0_0_30px_rgba(220,38,38,0.15)]"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <p className="text-left font-sans">{error}</p>
            </motion.div>
          )}

          {/* Large Google Sign-in Button */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 text-white font-semibold rounded-2xl px-10 py-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Glow effect behind button */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white/70" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-md">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            
            <span className="relative z-10 text-lg tracking-wide">
              {isLoading ? 'Verifying Credentials...' : 'Authenticate with Google'}
            </span>
            
            {!isLoading && (
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all relative z-10" />
            )}
          </motion.button>

        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="z-10 w-full py-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/40"
      >
        <span>Secure connection established. Activity logged.</span>
        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></div>
        <div className="flex gap-6 font-sans">
          <Link href="/legal/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/legal/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal/aup" className="hover:text-white transition-colors">
            Acceptable Use
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
