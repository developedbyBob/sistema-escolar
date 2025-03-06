// frontend/src/components/Menu.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Menu: React.FC = () => {
  const { user } = useAuth();
  
  // Determinar quais itens de menu mostrar com base no papel do usuário
  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: 'home' },
          { to: '/admin/usuarios', label: 'Usuários', icon: 'users' },
          { to: '/admin/alunos', label: 'Alunos', icon: 'user-graduate' },
          { to: '/admin/professores', label: 'Professores', icon: 'chalkboard-teacher' },
          { to: '/admin/turmas', label: 'Turmas', icon: 'users-class' },
          { to: '/admin/matriculas', label: 'Matrículas', icon: 'clipboard-list' },
          { to: '/admin/relatorios', label: 'Relatórios', icon: 'chart-bar' },
          { to: '/admin/configuracoes', label: 'Configurações', icon: 'cog' }
        ];
      case 'teacher':
        return [
          { to: '/professor/dashboard', label: 'Dashboard', icon: 'home' },
          { to: '/professor/turmas', label: 'Minhas Turmas', icon: 'users-class' },
          { to: '/professor/notas', label: 'Notas', icon: 'edit' },
          { to: '/professor/frequencia', label: 'Frequência', icon: 'clipboard-check' },
          { to: '/professor/atividades', label: 'Atividades', icon: 'tasks' },
          { to: '/professor/comunicados', label: 'Comunicados', icon: 'bullhorn' },
          { to: '/professor/perfil', label: 'Meu Perfil', icon: 'user-circle' }
        ];
      case 'student':
        return [
          { to: '/aluno/dashboard', label: 'Dashboard', icon: 'home' },
          { to: '/aluno/boletim', label: 'Boletim', icon: 'file-alt' },
          { to: '/aluno/frequencia', label: 'Frequência', icon: 'calendar-check' },
          { to: '/aluno/atividades', label: 'Atividades', icon: 'book' },
          { to: '/aluno/horarios', label: 'Horários', icon: 'clock' },
          { to: '/aluno/comunicados', label: 'Comunicados', icon: 'bell' },
          { to: '/aluno/perfil', label: 'Meu Perfil', icon: 'user-circle' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Renderiza o ícone SVG correspondente ao nome do ícone
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'user-graduate':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0L3 9m0 0l9 5m0 0l9-5m0 5L12 19l-9-5" />
          </svg>
        );
      case 'chalkboard-teacher':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        );
      case 'users-class':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      // ... adicione outros ícones conforme necessário
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        );
    }
  };

  return (
    <div className="w-64 bg-blue-800 text-white p-4 h-full flex flex-col">
      {/* Cabeçalho do Menu */}
      <div className="pb-4 mb-4 border-b border-blue-700">
        <h2 className="text-xl font-bold">Sistema Escolar</h2>
        <p className="text-sm text-blue-300">{user?.role === 'admin' ? 'Administrador' : user?.role === 'teacher' ? 'Professor' : 'Aluno'}</p>
      </div>
      
      {/* Lista de itens do menu */}
      <nav className="flex-1">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-1">
              <Link 
                to={item.to} 
                className="flex items-center p-2 rounded hover:bg-blue-700 transition-colors"
              >
                <span className="mr-3">{renderIcon(item.icon)}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Rodapé do menu */}
      <div className="pt-4 mt-4 border-t border-blue-700 text-sm text-blue-300">
        <p>Versão 1.0.0</p>
      </div>
    </div>
  );
};

export default Menu;