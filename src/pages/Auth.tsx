import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully!');
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Please check your email for verification.');
    }
    setLoading(false);
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) {
        toast.error(error.message);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 relative overflow-hidden">
      {/* Left: Modern Hero Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative overflow-hidden bg-transparent">
        {/* Animated gradient blob background */}
        <div className="absolute left-1/2 top-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-400/60 via-purple-400/40 to-pink-400/60 blur-[120px] animate-blob z-0" />
        {/* Glass panel with shimmer */}
        <div className="relative z-10 flex flex-col items-center justify-center px-12 py-16 rounded-3xl bg-white/40 dark:bg-white/10 backdrop-blur-xl shadow-2xl border border-white/30 dark:border-white/10 glass-shimmer">
          {/* Logo/Icon */}
          <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 shadow-lg">
            <span className="text-white text-4xl font-extrabold tracking-tight select-none">V</span>
          </div>
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 drop-shadow-lg text-center leading-tight">
            Organize Your <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Tasks</span><br />
            Like Never Before
          </h2>
          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 max-w-md mx-auto font-medium text-center mb-2">
            Visual Task Board brings clarity, focus, and beauty to your productivity.
          </p>
        </div>
      </div>
      {/* Right: Auth Card */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6 min-h-screen">
        <Card className="w-full max-w-md glassmorphism-card shadow-2xl border-0 dark:bg-white/10 dark:backdrop-blur-lg dark:border-white/10 px-8 py-10 md:px-12 md:py-14 transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl">
          <CardHeader className="space-y-1 text-center p-0 mb-6">
            <CardTitle className="text-3xl font-extrabold tracking-tight mb-1">{tab === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
            <p className="text-gray-500 dark:text-gray-300 text-base font-medium">to continue to Visual Task Board</p>
          </CardHeader>

          <Tabs defaultValue="signin" value={tab} onValueChange={v => setTab(v as 'signin' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/10">
              <TabsTrigger value="signin" className="py-2 text-lg font-semibold data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 data-[state=active]:shadow">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="py-2 text-lg font-semibold data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 data-[state=active]:shadow">Sign Up</TabsTrigger>
            </TabsList>

            {/* Google login only */}
            <div className="flex flex-col gap-2 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full flex gap-2 items-center justify-center font-semibold text-base bg-white/90 dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 shadow-md transition-all py-3 rounded-xl"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <FcGoogle className="w-6 h-6" /> Continue with Google
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 font-semibold tracking-wide">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} autoComplete="on">
                <CardContent className="space-y-6 p-0">
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="peer h-12 px-4 rounded-lg border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-white/5 shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-500 transition-all text-base placeholder:opacity-70"
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="peer h-12 px-4 rounded-lg border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-white/5 shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-500 transition-all text-base pr-12 placeholder:opacity-70"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 dark:hover:text-purple-400 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </CardContent>
                <CardFooter className="mt-8 p-0">
                  <Button type="submit" className="w-full py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 shadow-lg transition-all" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} autoComplete="on">
                <CardContent className="space-y-6 p-0">
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="peer h-12 px-4 rounded-lg border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-white/5 shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-500 transition-all text-base placeholder:opacity-70"
                      autoComplete="email"
                    />
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password (min. 6 characters)"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="peer h-12 px-4 rounded-lg border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-white/5 shadow-sm focus:ring-2 focus:ring-blue-400 dark:focus:ring-purple-500 transition-all text-base pr-12 placeholder:opacity-70"
                      autoComplete="new-password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 dark:hover:text-purple-400 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </CardContent>
                <CardFooter className="mt-8 p-0">
                  <Button type="submit" className="w-full py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 shadow-lg transition-all" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <style>{`
        .glassmorphism-card {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(24px) saturate(180%);
          border-radius: 2rem;
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.18);
          border: 1.5px solid rgba(180,180,255,0.12);
        }
        .dark .glassmorphism-card {
          background: rgba(30,30,40,0.92);
          color: #f3f3f3;
          border: 1.5px solid rgba(255,255,255,0.10);
        }
        .glass-shimmer {
          position: relative;
          overflow: hidden;
        }
        .glass-shimmer::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.32) 40%, rgba(255,255,255,0.08) 100%);
          opacity: 0.7;
          filter: blur(12px);
          pointer-events: none;
          animation: shimmerMove 6s linear infinite;
        }
        @keyframes shimmerMove {
          0% { transform: translateX(-20%) translateY(-10%) rotate(0deg); }
          100% { transform: translateX(20%) translateY(10%) rotate(2deg); }
        }
        @media (max-width: 768px) {
          .glassmorphism-card { border-radius: 1.2rem; padding: 1.5rem !important; }
        }
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .animate-blob {
          animation: blobMove 12s infinite linear alternate;
        }
        @keyframes blobMove {
          0% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
          50% { transform: translate(-60%,-55%) scale(1.08) rotate(8deg); }
          100% { transform: translate(-50%,-50%) scale(1) rotate(-6deg); }
        }
      `}</style>
    </div>
  );
};

export default Auth;
