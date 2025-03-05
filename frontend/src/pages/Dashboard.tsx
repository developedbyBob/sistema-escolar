// frontend/src/pages/Dashboard.tsx
import React from 'react';
import Menu from '../components/Menu'; // Importando o componente Menu

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Menu) */}
      <Menu />

      {/* Conteúdo principal */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cards de exemplo */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Bem-vindo!</h2>
            <p className="text-gray-600">Aqui você pode gerenciar suas atividades.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Notas</h2>
            <p className="text-gray-600">Acompanhe suas notas e desempenho.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Frequência</h2>
            <p className="text-gray-600">Verifique suas presenças e faltas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;