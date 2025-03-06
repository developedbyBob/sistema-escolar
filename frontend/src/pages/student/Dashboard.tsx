// frontend/src/pages/student/Dashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Menu from '../../components/Menu';

const StudentDashboard: React.FC = () => {
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
            <h1 className="text-2xl font-bold text-gray-800">Portal do Aluno</h1>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Olá, {user?.name}</span>
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
          {/* Barra de progresso do semestre */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Progresso do Semestre</h2>
              <span className="text-sm font-medium text-blue-600">65% concluído</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Cartões de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Frequência</h2>
              <div className="text-3xl font-bold text-gray-800">96%</div>
              <p className="text-xs text-gray-500 mt-2">4 faltas registradas</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Média Geral</h2>
              <div className="text-3xl font-bold text-green-600">8.5</div>
              <p className="text-xs text-gray-500 mt-2">De 10 possíveis</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Disciplinas</h2>
              <div className="text-3xl font-bold text-gray-800">8</div>
              <p className="text-xs text-gray-500 mt-2">Cursando neste semestre</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-sm font-medium text-gray-500 mb-2">Atividades</h2>
              <div className="text-3xl font-bold text-red-600">3</div>
              <p className="text-xs text-gray-500 mt-2">Pendentes esta semana</p>
            </div>
          </div>

          {/* Próximas aulas e Atividades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Próximas aulas */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold">Horário de Hoje</h2>
              </div>
              <div className="p-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Matemática</p>
                        <p className="text-sm text-gray-500">Prof. Carlos Silva</p>
                      </div>
                      <span className="text-sm text-gray-600">07:30 - 09:10</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Português</p>
                        <p className="text-sm text-gray-500">Profa. Ana Oliveira</p>
                      </div>
                      <span className="text-sm text-gray-600">09:30 - 11:10</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Ciências</p>
                        <p className="text-sm text-gray-500">Prof. Miguel Santos</p>
                      </div>
                      <span className="text-sm text-gray-600">13:30 - 15:10</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Atividades pendentes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold">Atividades Pendentes</h2>
              </div>
              <div className="p-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Trabalho de História</p>
                        <p className="text-sm text-gray-500">Entrega: 08/03/2025</p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Urgente</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Lista de Exercícios de Matemática</p>
                        <p className="text-sm text-gray-500">Entrega: 10/03/2025</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Em breve</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Relatório de Experimento de Ciências</p>
                        <p className="text-sm text-gray-500">Entrega: 15/03/2025</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Planejado</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Notas recentes e Comunicados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notas recentes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold">Notas Recentes</h2>
              </div>
              <div className="p-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Avaliação Bimestral - Matemática</p>
                        <p className="text-sm text-gray-500">28/02/2025</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">9.0</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Trabalho em Grupo - História</p>
                        <p className="text-sm text-gray-500">25/02/2025</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">8.5</span>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">Prova Mensal - Português</p>
                        <p className="text-sm text-gray-500">20/02/2025</p>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">7.0</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Comunicados */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-lg font-semibold">Comunicados</h2>
              </div>
              <div className="p-5">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <p className="font-medium">Semana de Avaliações</p>
                    <p className="text-sm text-gray-500">01/03/2025</p>
                    <p className="text-sm mt-1">As avaliações bimestrais serão realizadas entre 15/03 e 22/03. O calendário detalhado está disponível na área de documentos.</p>
                  </li>
                  <li className="py-3">
                    <p className="font-medium">Feira de Ciências</p>
                    <p className="text-sm text-gray-500">25/02/2025</p>
                    <p className="text-sm mt-1">A Feira de Ciências anual será realizada no dia 20/03. Os grupos devem confirmar seus projetos até 10/03.</p>
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

export default StudentDashboard;