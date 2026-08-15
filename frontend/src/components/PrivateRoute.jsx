// PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';

/**
 * Decode JWT and check if expired
 */
const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp is in seconds, convert to ms
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

/**
 * PrivateRoute component to protect routes
 * @param {Object} props
 * @param {boolean} props.adminOnly - If true, only allows admin/super_admin roles
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/signin')
 * @param {string} props.adminRedirectTo - Path to redirect if not admin (default: '/dashboard')
 */
const PrivateRoute = ({ 
  adminOnly = false, 
  redirectTo = '/signin', 
  adminRedirectTo = '/dashboard' 
}) => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // If no userInfo, redirect to login
  if (!userInfo) {
    return <Navigate to={redirectTo} replace />;
  }

  // If token exists but is invalid/expired, logout and redirect
  const token = userInfo.token;
  if (token && !isTokenValid(token)) {
    dispatch(logout());
    return <Navigate to={redirectTo} replace />;
  }

  // Admin-only check
  if (adminOnly) {
    const isAdmin = userInfo.role === 'admin' || userInfo.role === 'super_admin';
    if (!isAdmin) {
      return <Navigate to={adminRedirectTo} replace />;
    }
  }

  // Authorized: render child routes
  return <Outlet />;
};

export default PrivateRoute;