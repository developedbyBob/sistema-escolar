// frontend/src/App.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Importação do CSS

function App() {
  const navigate = useNavigate();

  // Redireciona para a página de login ao carregar a raiz ("/")
  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null; // Não renderiza nada, pois o redirecionamento é imediato
}

export default App;