import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, getSessionForContext } = useAuth();
  const { slug } = useParams();
  const location = useLocation();

  // Determine which session to check based on route
  let session = user;
  if (location.pathname.startsWith('/superadmin')) {
    session = getSessionForContext('superadmin');
  } else if (slug && location.pathname.includes('/admin')) {
    session = getSessionForContext('tenant', slug);
  } else if (slug && location.pathname.includes('/minha-conta')) {
    session = getSessionForContext('subscriber', slug);
  }

  if (!session) {
    const loginPath = slug ? `/${slug}/login` : '/login';
    return <Navigate to={loginPath} replace />;
  }
  if (!allowedRoles.includes(session.role)) {
    const loginPath = slug ? `/${slug}/login` : '/login';
    return <Navigate to={loginPath} replace />;
  }
  return <>{children}</>;
}
