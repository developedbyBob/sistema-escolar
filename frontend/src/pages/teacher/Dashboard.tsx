// frontend/src/pages/teacher/Dashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral */}
      <Menu />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Portal do Professor</h1>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Olá, Prof. {user?.name}</span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Cards de informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-lg font-semibold mb-4">Minhas Turmas</h2>
              <div className="text-3xl font-bold text-gray-800">5</div>
              <p className="text-sm text-gray-500 mt-2">Turmas atribuídas neste semestre</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-lg font-semibold mb-4">Alunos</h2>
              <div className="text-3xl font-bold text-gray-800">127</div>
              <p className="text-sm text-gray-500 mt-2">Total de alunos sob sua supervisão</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-lg font-semibold mb-4">Próximas Avaliações</h2>
              <div className="text-3xl font-bold text-gray-800">3</div>
              <p className="text-sm text-gray-500 mt-2">Avaliações agendadas para esta semana</p>
            </div>
          </div>

          {/* Próximas aulas */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold">Próximas Aulas</h2>
            </div>
            <div className="p-5">
              <ul className="divide-y divide-gray-200">
                <li className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Matemática - 9º Ano A</p>
                      <p className="text-sm text-gray-500">Hoje, 07:30 - 09:10</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Sala 103
                    </span>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Matemática - 8º Ano B</p>
                      <p className="text-sm text-gray-500">Hoje, 09:30 - 11:10</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Sala 105
                    </span>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Matemática - 7º Ano C</p>
                      <p className="text-sm text-gray-500">Amanhã, 07:30 - 09:10</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      Sala 107
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Atividades pendentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold">Notas Pendentes</h2>
              </div>
              <div className="p-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Avaliação Bimestral - 9º Ano A</p>
                      <p className="text-sm text-gray-500">Prazo: 10/03/2025</p>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                      Lançar
                    </button>
                  </li>
                  <li className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Trabalho em Grupo - 8º Ano B</p>
                      <p className="text-sm text-gray-500">Prazo: 15/03/2025</p>
                    </div>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">
                      Lançar
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold">Comunicados Recentes</h2>
              </div>
              <div className="p-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <p className="font-medium">Reunião Pedagógica</p>
                    <p className="text-sm text-gray-500">10/03/2025, 18:30 - Sala dos Professores</p>
                    <p className="text-sm mt-1">Discussão sobre o novo método de avaliação para o próximo bimestre.</p>
                  </li>
                  <li className="py-3">
                    <p className="font-medium">Feira de Ciências</p>
                    <p className="text-sm text-gray-500">20/03/2025 - Pátio Central</p>
                    <p className="text-sm mt-1">Preparação dos alunos para a Feira de Ciências anual.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;