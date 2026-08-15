import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation, useGoogleLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  LogIn,
} from 'lucide-react';

// Shared field styles
const fieldBase =
  'w-full px-4 py-3 bg-white/[0.04] border rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#f4a825] focus:ring-1 focus:ring-[#f4a825]/40 transition-all';
const fieldOk = 'border-white/10';
const fieldErr = 'border-red-400/70';
const labelCls = 'block text-xs font-medium text-white/50 tracking-wide mb-1.5';

// Helper to check if profile is complete
const isProfileComplete = (user) => {
  if (!user) return false;
  // Required fields from signup step 3
  const required = ['dateOfBirth', 'gender', 'location'];
  for (const field of required) {
    if (!user[field] || user[field] === '') return false;
  }
  return true;
};

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  // Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ email: true, password: true });
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      setSuccessMessage('Login successful! Redirecting...');

      // Check if profile is complete
      if (isProfileComplete(result)) {
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setTimeout(() => navigate('/profile', { state: { incomplete: true } }), 1000);
      }
    } catch (err) {
      setErrorMessage(err.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Google login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    if (!googleToken) return;

    try {
      const result = await googleLogin({ token: googleToken }).unwrap();
      dispatch(setCredentials(result));
      setSuccessMessage('Login successful! Redirecting...');

      if (isProfileComplete(result)) {
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setTimeout(() => navigate('/profile', { state: { incomplete: true } }), 1000);
      }
    } catch (err) {
      setErrorMessage(err.data?.message || 'Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setErrorMessage('Google login failed. Please try again.');
  };

  return (
    <div className="h-screen bg-[#0c0c0d] flex">
      {/* LEFT SIDE - IMAGE */}
      <div
        className="relative hidden lg:block w-1/2 h-full bg-cover bg-center flex-shrink-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-[#0c0c0d]/20 to-transparent" />
        <div className="absolute bottom-12 left-10 right-10">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Teens Connect Logo" className="w-12 h-12 object-contain" />
            <span className="text-white text-2xl font-medium">Teens Connect</span>
          </div>
          <h1 className="text-white text-3xl lg:text-4xl font-medium leading-snug">
            Welcome back.
            <br />
            Let's continue creating.
          </h1>
          <p className="text-white/50 text-sm mt-4 max-w-sm leading-relaxed">
            Sign in to access your network, share ideas, and collaborate with young creators.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 h-full overflow-y-auto px-6 sm:px-10 lg:px-16 py-6 sm:py-8 lg:py-10">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <img src="/logo.png" alt="Teens Connect Logo" className="w-10 h-10 object-contain" />
            <span className="text-white text-xl font-medium">Teens Connect</span>
          </div>

          {/* Back button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/')}
              className="text-white/40 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          {/* Error/Success Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-[#0d6b57]/10 border border-[#0d6b57]/30 text-[#3fd6b4] rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-[#3fd6b4] flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Signin Form */}
          <div>
            <div className="w-11 h-11 bg-[#f4a825]/15 rounded-xl flex items-center justify-center mb-5">
              <LogIn size={20} className="text-[#f4a825]" />
            </div>
            <h2 className="text-2xl font-medium text-white">Welcome back</h2>
            <p className="text-white/40 text-sm mt-2 mb-6 leading-relaxed">
              Sign in to your account and pick up where you left off.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`${fieldBase} ${touched.email && errors.email ? fieldErr : fieldOk}`}
                  placeholder="e.g. john@example.com"
                />
                {touched.email && errors.email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                )}
              </div>

              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`${fieldBase} pr-9 ${touched.password && errors.password ? fieldErr : fieldOk}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
                )}
                <div className="text-right mt-1.5">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-white/30 hover:text-[#f4a825] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#f4a825] text-[#1a1305] py-3 rounded-xl font-semibold text-sm hover:bg-[#e79a13] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1a1305] border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Divider + Google */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#0c0c0d] text-white/30">or continue with</span>
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
            {isGoogleLoading && (
              <div className="text-center text-[#f4a825] text-sm mt-2 flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#f4a825] border-t-transparent rounded-full animate-spin" />
                Signing in with Google...
              </div>
            )}

            <p className="text-center text-xs text-white/40 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#f4a825] font-medium hover:text-[#f4a825]/80 transition-colors">
                Create one now
              </Link>
            </p>

            <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300/70 text-center">
                🔐 Secure authentication. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;