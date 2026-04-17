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
  CheckCircle,
  ArrowRight
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
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start min-h-[90vh]">
          
          {/* Left Side - Brand Info (Hidden on mobile) */}
          <div className="hidden lg:block text-white sticky top-12">
            <div className="space-y-8">
              <div>
                <img src="/logo.png" alt="TeensConnect" className="h-16 w-auto mb-6" />
                <h1 className="text-5xl font-bold mb-4 leading-tight">
                  Welcome Back to<br />
                  <span className="text-[#f4a825]">Teen Talent</span>
                  Community
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Sign in to access your account, showcase your skills, connect with mentors, and discover new opportunities.
                </p>
              </div>

              <div className="space-y-6 pt-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f4a825]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#f4a825]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Showcase Your Talent</h3>
                    <p className="text-gray-400 text-sm">Get discovered by top companies and mentors</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f4a825]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#f4a825]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Build Your Network</h3>
                    <p className="text-gray-400 text-sm">Connect with like-minded teens and industry experts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f4a825]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#f4a825]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Access Opportunities</h3>
                    <p className="text-gray-400 text-sm">Find internships, scholarships, and events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Signin Form */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#1d2b4f] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f4a825]/20 rounded-lg flex items-center justify-center">
                  <LogIn className="w-5 h-5 text-[#f4a825]" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">Welcome Back!</h2>
                  <p className="text-gray-300 text-sm">Sign in to continue your journey</p>
                </div>
              </div>
            </div>

            <div className="p-6">
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
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Access your personalized dashboard</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">View and manage your applications</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">Connect with mentors and peers</p>
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
                  <Link 
                    to="/signup" 
                    className="text-[#f4a825] font-semibold hover:text-[#e79a13] transition-colors inline-flex items-center gap-1"
                  >
                    Create Account
                    <ArrowRight size={14} />
                  </Link>
                </p>
              </div>

              {/* Security Info */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800 text-center">
                  🔐 Secure authentication powered by Google<br />
                  Your data is protected and never shared
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;