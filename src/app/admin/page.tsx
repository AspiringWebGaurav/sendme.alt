'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, GoogleAuthProvider, signInWithPopup } from '@/services/firebase';
import { Shield, Loader2, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'gauravpatil9262@gmail.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already logged in
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
        prompt: 'select_account'
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
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-2xl shadow-xl overflow-hidden flex flex-col">
        
        <div className="p-8 pb-6 flex flex-col items-center text-center border-b border-border-subtle/50 bg-bg-surface-hover">
          <div className="w-16 h-16 bg-color-primary/10 rounded-full flex items-center justify-center mb-4 border border-color-primary/30">
            <Shield className="w-8 h-8 text-color-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">System Console</h1>
          <p className="text-text-secondary text-sm">
            Restricted access. Please authenticate to continue to the admin dashboard.
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-color-error/10 border border-color-error/30 text-color-error text-sm p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isLoading ? 'Authenticating...' : 'Sign in with Google'}
          </button>
        </div>
        
        <div className="py-4 text-center text-xs text-text-tertiary bg-bg-surface border-t border-border-subtle/30">
          Secure connection established. Your activity is logged.
        </div>
      </div>
    </div>
  );
}
