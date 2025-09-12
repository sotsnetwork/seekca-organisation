import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logoIcon from "@/assets/logo-icon.png";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set active tab based on URL query parameter
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  // Form states
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    fullName: '', 
    email: '', 
    password: '',
    confirmPassword: '',
    country: '',
    role: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: '' });


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      console.log('Attempting sign in with email:', signInData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      console.log('Auth response:', { data, error });

      if (error) {
        console.error('Auth error:', error);
        if (error.message === 'Invalid login credentials') {
          setMessage({ type: 'error', text: 'Invalid email or password. Please check your credentials and try again.' });
        } else {
          setMessage({ type: 'error', text: error.message });
        }
      } else {
        setMessage({ type: 'success', text: 'Successfully signed in!' });
        // Redirect to home page after successful sign in
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error) {
      console.error('Network error:', error);
      if (error instanceof Error && error.message.includes('fetch')) {
        setMessage({ type: 'error', text: 'Network connection failed. Please check your internet connection and try again.' });
      } else {
        setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate passwords match
    if (signUpData.password !== signUpData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (signUpData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      setIsLoading(false);
      return;
    }

    // Validate role selection
    if (!signUpData.role) {
      setMessage({ type: 'error', text: 'Please select your role (Professional or Hirer)' });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            country: signUpData.country,
            role: signUpData.role,
          }
        }
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        // Assign user role after successful signup
        if (data.user && signUpData.role) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: signUpData.role as 'professional' | 'hirer'
            });

          if (roleError) {
            console.error('Error assigning user role:', roleError);
          }
        }

        setMessage({ type: 'success', text: 'Account created successfully! Please check your email to verify your account.' });
        // Clear form
        setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '', country: '', role: '' });
        // Switch to sign in tab
        setTimeout(() => setActiveTab('signin'), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };



  const handleInputChange = (form: 'signin' | 'signup' | 'forgot', field: string, value: string) => {
    if (form === 'signin') {
      setSignInData(prev => ({ ...prev, [field]: value }));
    } else if (form === 'signup') {
      setSignUpData(prev => ({ ...prev, [field]: value }));
    } else if (form === 'forgot') {
      setForgotPasswordData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordData.email, {
        redirectTo: `${window.location.origin}/auth?tab=signin`,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Password reset email sent! Please check your email for further instructions.' 
        });
        // Clear form
        setForgotPasswordData({ email: '' });
        // Switch back to sign in tab after a delay
        setTimeout(() => setActiveTab('signin'), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={logoIcon} alt="SeekCa" className="w-8 h-8" />
            <span className="text-2xl font-heading font-bold text-foreground">SeekCa</span>
          </div>
          <p className="text-muted-foreground">Welcome to the future of remote collaboration</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
           <TabsList className="grid w-full grid-cols-3">
             <TabsTrigger value="signin">Sign In</TabsTrigger>
             <TabsTrigger value="signup">Get Started</TabsTrigger>
             <TabsTrigger value="forgot">Reset Password</TabsTrigger>
           </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => handleInputChange('signin', 'email', e.target.value)}
                      required
                    />
                  </div>
                                     <div>
                     <Label htmlFor="password">Password</Label>
                     <Input
                       id="password"
                       type="password"
                       placeholder="Enter your password"
                       value={signInData.password}
                       onChange={(e) => handleInputChange('signin', 'password', e.target.value)}
                       required
                     />
                     <div className="text-right mt-2">
                       <button
                         type="button"
                         onClick={() => setActiveTab('forgot')}
                         className="text-sm text-primary hover:underline"
                       >
                         Forgot your password?
                       </button>
                     </div>
                   </div>

                   <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? "Signing in..." : "Sign In"}
                   </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Create your account to join the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={(e) => handleInputChange('signup', 'fullName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => handleInputChange('signup', 'email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={signUpData.password}
                      onChange={(e) => handleInputChange('signup', 'password', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => handleInputChange('signup', 'confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="Enter your country"
                      value={signUpData.country}
                      onChange={(e) => handleInputChange('signup', 'country', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">I am a</Label>
                    <Select 
                      value={signUpData.role} 
                      onValueChange={(value) => handleInputChange('signup', 'role', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional (looking for work)</SelectItem>
                        <SelectItem value="hirer">Hirer (looking to hire)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
                     </TabsContent>

           <TabsContent value="forgot">
             <Card>
               <CardHeader>
                 <CardTitle>Reset Password</CardTitle>
                 <CardDescription>Enter your email to receive password reset instructions</CardDescription>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleForgotPassword} className="space-y-4">
                   <div>
                     <Label htmlFor="forgotEmail">Email</Label>
                     <Input
                       id="forgotEmail"
                       type="email"
                       placeholder="Enter your email address"
                       value={forgotPasswordData.email}
                       onChange={(e) => handleInputChange('forgot', 'email', e.target.value)}
                       required
                     />
                   </div>

                   <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? "Sending..." : "Send Reset Email"}
                   </Button>
                 </form>
               </CardContent>
             </Card>
           </TabsContent>


         </Tabs>
      </div>
    </div>
  );
}