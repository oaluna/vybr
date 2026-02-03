import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/appStore';
import { useState, useId } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { lovable } from '@/integrations/lovable';
import { z } from 'zod';
import vybrLogo from '@/assets/vybr-logo.png';

const authSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100)
});

export const AuthScreen = () => {
  const { setScreen } = useAppStore();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const handleSubmit = async () => {
    setError('');

    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message);
        }
      } else {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          setError(signUpError.message);
        } else {
          setScreen('orientation');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin
      });
      if (result.redirected) {
        return;
      }
      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden animated-gradient-bg">
      {/* Aurora blobs - decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full bg-primary/10 blur-[120px] animate-aurora" />
        <div className="absolute -bottom-1/2 -right-1/4 w-[70%] h-[70%] rounded-full bg-secondary/15 blur-[100px] animate-aurora" style={{ animationDelay: '4s' }} />
      </div>

      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="mb-8"
      >
        <motion.img
          src="/lovable-uploads/35b567d7-5e7c-4690-8d1f-80da3a49f90a.png"
          alt="Vybr - Match by your digital soul"
          className="w-48 h-48 object-contain"
          animate={{
            filter: [
              'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))',
              'drop-shadow(0 0 40px hsl(var(--primary) / 0.5))',
              'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        aria-labelledby="auth-heading"
      >
        <h1 id="auth-heading" className="sr-only">
          {isLogin ? 'Sign in to Vybr' : 'Create a Vybr account'}
        </h1>

        {/* Google Sign In */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div className="relative my-4" role="separator">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor={emailId} className="sr-only">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <Input
              id={emailId}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 glass border-border/50 focus:border-primary/50"
              maxLength={255}
              autoComplete="email"
              aria-describedby={error ? errorId : undefined}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor={passwordId} className="sr-only">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <Input
              id={passwordId}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 glass border-border/50 focus:border-primary/50"
              maxLength={100}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
        </div>

        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-destructive text-sm text-center"
            role="alert"
            aria-live="polite"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          variant="glow"
          size="lg"
          className="w-full"
          disabled={loading || !email || !password}
        >
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className="text-primary font-medium">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </button>
        </div>
      </motion.form>
    </div>
  );
};
