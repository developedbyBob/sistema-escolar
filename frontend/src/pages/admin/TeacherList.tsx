// frontend/src/pages/admin/TeacherList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Menu from '../../components/Menu';

// Tipos
interface Teacher {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  status: string;
  subjects: string[];
}

interface PaginationData {
  totalPages: number;
  currentPage: number;
  totalTeachers: number;
}

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    totalPages: 1,
    currentPage: 1,
    totalTeachers: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [nameFilter, setNameFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [subjects, setSubjects] = useState<string[]>([]);
  
  // Carregar lista de disciplinas disponíveis
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teachers/subjects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSubjects(response.data);
      } catch (err) {
        console.error('Erro ao carregar disciplinas:', err);
      }
    };
    
    fetchSubjects();
  }, []);
  
  // Carregar professores
  const fetchTeachers = async (page: number = 1, filters: any = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir parâmetros de consulta
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      
      if (filters.name) params.append('name', filters.name);
      if (filters.status) params.append('status', filters.status);
      if (filters.subject) params.append('subject', filters.subject);
      
      // Fazer requisição
      const response = await axios.get(`http://localhost:5000/api/teachers?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setTeachers(response.data.teachers);
      setPagination({
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        totalTeachers: response.data.totalTeachers
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar professores');
      console.error('Erro ao carregar professores:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar professores na montagem do componente
  useEffect(() => {
    fetchTeachers();
  }, []);
  
  // Atualizar ao mudar página ou filtros
  useEffect(() => {
    const filters = {
      name: nameFilter,
      status: statusFilter,
      subject: subjectFilter
    };
    
    fetchTeachers(currentPage, filters);
  }, [currentPage, nameFilter, statusFilter, subjectFilter]);
  
  // Manipular filtro
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Resetar para a primeira página ao filtrar
  };
  
  // Remover filtros
  const clearFilters = () => {
    setNameFilter('');
    setStatusFilter('');
    setSubjectFilter('');
    setCurrentPage(1);
  };
  
  // Formatar status para exibição
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Afastado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Desligado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Excluir professor
  const handleDeleteTeacher = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o professor ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/teachers/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Recarregar lista de professores
        fetchTeachers(currentPage, { name: nameFilter, status: statusFilter, subject: subjectFilter });
      } catch (err: any) {
        alert(err.response?.data?.message || 'Erro ao excluir professor');
        console.error('Erro ao excluir professor:', err);
      }
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral */}
      <Menu />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Cabeçalho */}
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Professores</h1>
            <Link 
              to="/admin/professores/novo" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Adicionar Professor
            </Link>
          </div>
        </header>
        
        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
              <div className="w-full md:w-auto flex-1">
                <label htmlFor="nameFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Professor
                </label>
                <input
                  type="text"
                  id="nameFilter"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar por nome..."
                />
              </div>
              
              <div className="w-full md:w-auto">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Afastado">Afastado</option>
                  <option value="Desligado">Desligado</option>
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Disciplina
                </label>
                <select
                  id="subjectFilter"
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Filtrar
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>
          
          {/* Mensagem de erro */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Loading indicator */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Tabela de professores */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Lista de Professores</h2>
                    <span className="text-sm text-gray-500">
                      {pagination.totalTeachers} professores encontrados
                    </span>
                  </div>
                </div>
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Disciplinas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teachers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          Nenhum professor encontrado.
                        </td>
                      </tr>
                    ) : (
                      teachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {teacher.employeeId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                <div className="text-sm text-gray-500">{teacher.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {teacher.subjects.join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(teacher.status)}`}>
                              {teacher.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              to={`/admin/professores/${teacher._id}`} 
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Detalhes
                            </Link>
                            <Link
                              to={`/admin/professores/editar/${teacher._id}`}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDeleteTeacher(teacher._id, teacher.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                
                {/* Paginação */}
                {pagination.totalPages > 1 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando <span className="font-medium">10</span> de{' '}
                          <span className="font-medium">{pagination.totalTeachers}</span> professores
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            Anterior
                          </button>
                          
                          {/* Botões de página - mostrar apenas algumas páginas */}
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            // Ajustar páginas mostradas conforme a página atual
                            let pageNum = i + 1;
                            if (currentPage > 3 && pagination.totalPages > 5) {
                              pageNum = currentPage - 2 + i;
                              if (pageNum > pagination.totalPages) {
                                pageNum = pagination.totalPages - (4 - i);
                              }
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                  currentPage === pageNum
                                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => setCurrentPage(currentPage < pagination.totalPages ? currentPage + 1 : pagination.totalPages)}
                            disabled={currentPage === pagination.totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === pagination.totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            Próxima
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TeacherList;