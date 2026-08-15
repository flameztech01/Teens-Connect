// PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PrivateRoute component to protect routes
 * @param {Object} props
 * @param {boolean} props.adminOnly - If true, only allows admin/super_admin roles
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/signin')
 * @param {string} props.adminRedirectTo - Path to redirect if not admin (default: '/dashboard')
 */
const PrivateRoute = ({ adminOnly = false, redirectTo = '/signin', adminRedirectTo = '/dashboard' }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Not authenticated
  if (!userInfo) {
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