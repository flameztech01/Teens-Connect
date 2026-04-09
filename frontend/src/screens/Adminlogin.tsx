import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAdminLoginMutation } from '../slices/adminApiSlice';
import { setAdminCredentials } from '../slices/adminAuthSlice';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  LogIn
} from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { adminInfo } = useSelector((state: any) => state.adminAuth);

  // Redirect if already logged in
  useEffect(() => {
    if (adminInfo) {
      navigate('/admin/dashboard');
    }
  }, [adminInfo, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const result = await adminLogin(formData).unwrap();
      console.log('Admin login result:', result);
      
      // Store admin info in Redux using adminAuthSlice
      dispatch(setAdminCredentials(result));
      
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1d2b4f] via-[#0d6b57] to-[#f4a825] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f4a825] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0d6b57] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1d2b4f] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo and Title */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/logo.png" alt="TeensConnect" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-white">TeensConnect</h1>
                <p className="text-xs text-white/70">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in-up delay-200">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1d2b4f] to-[#0d6b57] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1d2b4f]">Admin Login</h2>
              <p className="text-gray-500 text-sm mt-2">Access the admin dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors"
                    placeholder="admin@teensconnect.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-[#1d2b4f] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#f4a825] focus:ring-2 focus:ring-[#f4a825] focus:ring-opacity-20 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#f4a825] text-white py-3 rounded-lg font-semibold hover:bg-[#e79a13] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Login to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Back to Home Link */}
            <div className="mt-6 text-center">
              <Link 
                to="/" 
                className="text-sm text-gray-500 hover:text-[#f4a825] transition-colors"
              >
                ← Back to Homepage
              </Link>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 text-center">
                🔐 This area is restricted to authorized administrators only.<br />
                All login attempts are logged and monitored.
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
      `}</style>
    </div>
  );
};

export default AdminLogin;