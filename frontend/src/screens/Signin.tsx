import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useGoogleLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { 
  Award,
  Users,
  Sparkles,
  LogIn,
  CheckCircle
} from 'lucide-react';

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Check if already logged in
  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;
    
    if (!googleToken) {
      console.error('No Google token received');
      return;
    }

    try {
      const result = await googleLogin({ token: googleToken }).unwrap();
      console.log('Login result:', result);
      
      // Store user info in Redux (token is in httpOnly cookie)
      dispatch(setCredentials(result));
      
      setSuccessMessage('Login successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrors({ submit: error.data?.message || 'Login failed. Please try again.' });
      // Clear success message if any
      setSuccessMessage('');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setErrors({ submit: 'Google login failed. Please try again.' });
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1d2b4f] via-[#0d6b57] to-[#f4a825] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f4a825] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0d6b57] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1d2b4f] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Brand Info */}
          <div className="text-white space-y-8">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="TeensConnect" className="h-12 w-auto" />
                <div>
                  <h1 className="text-3xl font-bold">TeensConnect</h1>
                  <p className="text-sm opacity-90">Connect • Discover • Grow</p>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Welcome Back to
                <span className="text-[#f4a825]"> Teen Talent</span>
                Community
              </h2>
              
              <p className="text-lg opacity-90 mb-8">
                Sign in to access your account, showcase your skills, connect with mentors, and discover new opportunities.
              </p>
            </div>

            <div className="space-y-6 animate-fade-in-up delay-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4a825] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Showcase Your Talent</h3>
                  <p className="text-sm opacity-80">Get discovered by top companies and mentors</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4a825] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Build Your Network</h3>
                  <p className="text-sm opacity-80">Connect with like-minded teens and industry experts</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f4a825] bg-opacity-20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#f4a825]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Access Opportunities</h3>
                  <p className="text-sm opacity-80">Find internships, scholarships, and events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signin Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 animate-fade-in-up delay-300">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1d2b4f] mb-2">Welcome Back!</h3>
              <p className="text-gray-600">Sign in to continue your journey</p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* Feature Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Access your personalized dashboard</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">View and manage your applications</p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Connect with mentors and peers</p>
              </div>
            </div>

            {/* Google Signin Button */}
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_blue"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>

              {isLoading && (
                <div className="text-center text-[#0d6b57] font-semibold flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0d6b57] border-t-transparent rounded-full animate-spin"></div>
                  Signing you in...
                </div>
              )}
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#f4a825] font-semibold hover:text-[#e79a13] transition-colors">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                🔐 Secure authentication powered by Google<br />
                Your data is protected and never shared
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Signin;