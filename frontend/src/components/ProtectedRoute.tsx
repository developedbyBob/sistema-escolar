// frontend/src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'teacher' | 'student')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Verifica se a autenticação ainda está carregando
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se houver restrição de papéis e o usuário não tiver permissão
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redireciona para o dashboard apropriado com base no papel do usuário
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'teacher') {
      return <Navigate to="/professor/dashboard" replace />;
    } else if (user.role === 'student') {
      return <Navigate to="/aluno/dashboard" replace />;
    }
  }

  // Permite o acesso ao conteúdo protegido
  return <Outlet />;
};

export default ProtectedRoute;