// frontend/src/components/Menu.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <div className="w-64 bg-blue-600 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul>
        <li className="mb-2">
          <Link to="/dashboard" className="block p-2 hover:bg-blue-700 rounded">
            Dashboard
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/alunos" className="block p-2 hover:bg-blue-700 rounded">
            Alunos
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/professores" className="block p-2 hover:bg-blue-700 rounded">
            Professores
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/turmas" className="block p-2 hover:bg-blue-700 rounded">
            Turmas
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/notas" className="block p-2 hover:bg-blue-700 rounded">
            Notas
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/frequencia" className="block p-2 hover:bg-blue-700 rounded">
            Frequência
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;