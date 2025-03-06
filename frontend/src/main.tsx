// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import App from './App';
import Login from './pages/Login';

// Dashboards específicos por papel
import AdminDashboard from './pages/admin/Dashboard';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';

// Páginas administrativas - Alunos
import UserManagement from './pages/admin/UserManagement';
import StudentList from './pages/admin/StudentList';
import StudentForm from './pages/admin/StudentForm';
import StudentDetails from './pages/admin/StudentDetails';

// Páginas administrativas - Professores
import TeacherList from './pages/admin/TeacherList';
import TeacherForm from './pages/admin/TeacherForm';
import TeacherDetails from './pages/admin/TeacherDetails';

// Páginas administrativas - Histórico Escolar
import AcademicRecordForm from './pages/admin/AcademicRecordForm';
//import AcademicRecordDetails from './pages/admin/AcademicRecordDetails';

// Estilos
import './index.css';

// Componente para redirecionar com base no papel do usuário
const RoleBasedRedirect = () => {
  return <Navigate to="/login" replace />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas de administrador */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/usuarios" element={<UserManagement />} />
            
            {/* Rotas de alunos */}
            <Route path="/admin/alunos" element={<StudentList />} />
            <Route path="/admin/alunos/novo" element={<StudentForm />} />
            <Route path="/admin/alunos/editar/:id" element={<StudentForm />} />
            <Route path="/admin/alunos/:id" element={<StudentDetails />} />
            
            {/* Rotas de professores */}
            <Route path="/admin/professores" element={<TeacherList />} />
            <Route path="/admin/professores/novo" element={<TeacherForm />} />
            <Route path="/admin/professores/editar/:id" element={<TeacherForm />} />
            <Route path="/admin/professores/:id" element={<TeacherDetails />} />
            
            {/* Rotas de histórico escolar */}
            <Route path="/admin/historico/novo" element={<AcademicRecordForm />} />
            <Route path="/admin/historico/editar/:id" element={<AcademicRecordForm />} />
            {/* <Route path="/admin/historico/:id" element={<AcademicRecordDetails />} /> */}
            
            {/* Outras rotas administrativas */}
            <Route path="/admin/turmas" element={<div>Turmas</div>} />
            <Route path="/admin/matriculas" element={<div>Matrículas</div>} />
            <Route path="/admin/relatorios" element={<div>Relatórios</div>} />
            <Route path="/admin/configuracoes" element={<div>Configurações</div>} />
          </Route>

          {/* Rotas de professor */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/professor/dashboard" element={<TeacherDashboard />} />
            <Route path="/professor/turmas" element={<div>Minhas Turmas</div>} />
            <Route path="/professor/notas" element={<div>Notas</div>} />
            <Route path="/professor/frequencia" element={<div>Frequência</div>} />
            <Route path="/professor/atividades" element={<div>Atividades</div>} />
            <Route path="/professor/comunicados" element={<div>Comunicados</div>} />
            <Route path="/professor/perfil" element={<div>Meu Perfil</div>} />
          </Route>

          {/* Rotas de aluno */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/aluno/dashboard" element={<StudentDashboard />} />
            <Route path="/aluno/boletim" element={<div>Boletim</div>} />
            <Route path="/aluno/frequencia" element={<div>Frequência</div>} />
            <Route path="/aluno/atividades" element={<div>Atividades</div>} />
            <Route path="/aluno/horarios" element={<div>Horários</div>} />
            <Route path="/aluno/comunicados" element={<div>Comunicados</div>} />
            <Route path="/aluno/perfil" element={<div>Meu Perfil</div>} />
          </Route>

          {/* Rota de fallback */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);