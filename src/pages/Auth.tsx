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
import { useLocation, useNavigate } from 'react-router-dom';
import EnhancedNavbar from '@/components/EnhancedNavbar';
import FloatingElements from '@/components/FloatingElements';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully!');
      let from = '/';
      if (location.state && typeof location.state === 'object' && 'from' in location.state) {
        const state = location.state as { from?: { pathname?: string } };
        if (state.from && typeof state.from.pathname === 'string') {
          from = state.from.pathname;
        }
      }
      navigate(from, { replace: true });
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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 text-white overflow-hidden relative flex flex-col">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl animate-bounce delay-700"></div>
        {/* Enhanced grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      <FloatingElements />
      {/* Navbar should not be centered, should match homepage */}
      <div className="relative z-20 w-full">
        <EnhancedNavbar />
      </div>
      {/* Auth card container */}
      <div className="flex-1 flex items-center justify-center w-full px-2 sm:px-4 md:px-0 py-8 relative z-10">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-purple-900/80 border border-white/10 shadow-2xl shadow-purple-900/30 backdrop-blur-2xl rounded-3xl px-3 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/30 animate-fade-in group">
          {/* Updated logo section - removed background, made bigger */}
          <div className="flex justify-center mb-6">
            <img 
              src="/Ticko-Logo.png" 
              alt="Ticko Logo" 
              className="w-20 h-20 object-contain drop-shadow-lg"
            />
          </div>
          <CardHeader className="space-y-1 text-center p-0 mb-4 sm:mb-6">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">{tab === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
            <p className="text-gray-400 text-base font-medium">to continue to Visual Task Board</p>
          </CardHeader>
          <Tabs defaultValue="signin" value={tab} onValueChange={v => setTab(v as 'signin' | 'signup')}>
            <TabsList className="w-full flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-4 sm:mb-6 gap-2">
              <TabsTrigger value="signin" className="flex-1 rounded-xl text-base font-semibold text-white py-2 sm:py-3 px-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-pink-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="flex-1 rounded-xl text-base font-semibold text-white py-2 sm:py-3 px-2 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-cyan-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105">Sign Up</TabsTrigger>
            </TabsList>
            <div className="flex flex-col gap-2 mb-4 sm:mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full flex gap-2 items-center justify-center font-semibold text-base bg-white/10 hover:bg-white/20 border border-white/20 shadow-md transition-all py-3 rounded-xl text-white"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <FcGoogle className="w-6 h-6" /> Continue with Google
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-400 font-semibold tracking-wide">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} autoComplete="on">
                <CardContent className="space-y-4 sm:space-y-6 p-0">
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="peer h-12 px-4 rounded-lg border border-white/10 bg-white/5 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all text-base placeholder:opacity-70 text-white"
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
                      className="peer h-12 px-4 rounded-lg border border-white/10 bg-white/5 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all text-base pr-12 placeholder:opacity-70 text-white"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </CardContent>
                <CardFooter className="mt-6 sm:mt-8 p-0">
                  <Button type="submit" className="w-full py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                    Sign In
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} autoComplete="on">
                <CardContent className="space-y-4 sm:space-y-6 p-0">
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="peer h-12 px-4 rounded-lg border border-white/10 bg-white/5 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all text-base placeholder:opacity-70 text-white"
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
                      className="peer h-12 px-4 rounded-lg border border-white/10 bg-white/5 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all text-base pr-12 placeholder:opacity-70 text-white"
                      autoComplete="new-password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword(v => !v)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </CardContent>
                <CardFooter className="mt-6 sm:mt-8 p-0">
                  <Button type="submit" className="w-full py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
                    Create Account
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
