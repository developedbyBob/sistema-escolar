// frontend/src/pages/admin/StudentForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../../components/Menu';

// Tipos
interface Student {
  _id?: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  cpf: string;
  rg: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber: string;
  status: string;
  currentClass?: string;
  guardians: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
    isMainContact: boolean;
  }[];
  observations: string;
  createUser?: boolean;
  password?: string;
}

interface ClassOption {
  _id: string;
  name: string;
}

const StudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Estado para o formulário
  const [formData, setFormData] = useState<Student>({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    cpf: '',
    rg: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    phoneNumber: '',
    status: 'Ativo',
    guardians: [
      {
        name: '',
        relationship: '',
        phoneNumber: '',
        email: '',
        isMainContact: true
      }
    ],
    observations: '',
    createUser: false,
    password: ''
  });
  
  // Estados auxiliares
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  
  // Carregar dados do aluno (modo edição)
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      
      axios.get(`http://localhost:5000/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        // Ajustar data de nascimento para o formato de entrada de data (YYYY-MM-DD)
        const student = response.data;
        if (student.dateOfBirth) {
          student.dateOfBirth = new Date(student.dateOfBirth).toISOString().split('T')[0];
        }
        
        // Ajustar currentClass para o ID da classe
        if (student.currentClass && student.currentClass._id) {
          student.currentClass = student.currentClass._id;
        }
        
        setFormData(student);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Erro ao carregar dados do aluno');
        console.error('Erro ao carregar dados:', err);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [id, isEditMode]);

  // Carregar lista de turmas disponíveis
  useEffect(() => {
    // Mock para classes - substituir por chamada à API quando disponível
    setClasses([
      { _id: '1', name: '9º Ano A' },
      { _id: '2', name: '9º Ano B' },
      { _id: '3', name: '8º Ano A' }
    ]);
    
    // Exemplo de como seria a chamada real:
    
    axios.get('http://localhost:5000/api/classes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      setClasses(response.data);
    })
    .catch(err => {
      console.error('Erro ao carregar turmas:', err);
    });
    
  }, []);

  // Manipular mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Verificar se é um campo aninhado (com ".")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof Student],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Manipular checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Manipular responsáveis
  const handleGuardianChange = (index: number, field: string, value: string | boolean) => {
    const updatedGuardians = [...formData.guardians];
    
    // Atualizar o campo do responsável específico
    updatedGuardians[index] = {
      ...updatedGuardians[index],
      [field]: value
    };
    
    // Se estiver marcando um contato principal, desmarque os outros
    if (field === 'isMainContact' && value === true) {
      updatedGuardians.forEach((guardian, i) => {
        if (i !== index) {
          guardian.isMainContact = false;
        }
      });
    }
    
    setFormData({
      ...formData,
      guardians: updatedGuardians
    });
  };

  // Adicionar um novo responsável
  const addGuardian = () => {
    setFormData({
      ...formData,
      guardians: [
        ...formData.guardians,
        {
          name: '',
          relationship: '',
          phoneNumber: '',
          email: '',
          isMainContact: false
        }
      ]
    });
  };

  // Remover um responsável
  const removeGuardian = (index: number) => {
    // Não permitir remover se só tiver um responsável
    if (formData.guardians.length <= 1) {
      return;
    }
    
    const updatedGuardians = [...formData.guardians];
    updatedGuardians.splice(index, 1);
    
    // Garantir que pelo menos um responsável seja o contato principal
    if (!updatedGuardians.some(g => g.isMainContact)) {
      updatedGuardians[0].isMainContact = true;
    }
    
    setFormData({
      ...formData,
      guardians: updatedGuardians
    });
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const dataToSend = { ...formData };
      
      // Remover campos vazios de responsáveis
      dataToSend.guardians = dataToSend.guardians.filter(
        guardian => guardian.name.trim() !== ''
      );
      
      // Remover password se não for criar usuário
      if (!dataToSend.createUser) {
        delete dataToSend.password;
      }
      
      if (isEditMode) {
        // Modo de edição
        await axios.put(`http://localhost:5000/api/students/${id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setSuccess('Aluno atualizado com sucesso!');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/admin/alunos');
        }, 2000);
      } else {
        // Modo de criação
        await axios.post('http://localhost:5000/api/students', dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setSuccess('Aluno cadastrado com sucesso!');
        
        // Limpar formulário e redirecionar após 2 segundos
        setFormData({
          name: '',
          email: '',
          dateOfBirth: '',
          gender: '',
          cpf: '',
          rg: '',
          address: {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: ''
          },
          phoneNumber: '',
          status: 'Ativo',
          guardians: [
            {
              name: '',
              relationship: '',
              phoneNumber: '',
              email: '',
              isMainContact: true
            }
          ],
          observations: '',
          createUser: false,
          password: ''
        });
        
        setTimeout(() => {
          navigate('/admin/alunos');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar aluno');
      console.error('Erro ao salvar:', err);
    } finally {
      setLoading(false);
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
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditMode ? 'Editar Aluno' : 'Novo Aluno'}
            </h1>
          </div>
        </header>
        
        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Alertas */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center h-16 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
            {/* Informações Básicas */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gênero
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="000.000.000-00"
                  />
                </div>
                
                <div>
                  <label htmlFor="rg" className="block text-sm font-medium text-gray-700 mb-1">
                    RG
                  </label>
                  <input
                    type="text"
                    id="rg"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Transferido">Transferido</option>
                    <option value="Formado">Formado</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="currentClass" className="block text-sm font-medium text-gray-700 mb-1">
                    Turma Atual
                  </label>
                  <select
                    id="currentClass"
                    name="currentClass"
                    value={formData.currentClass || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione...</option>
                    {classes.map(classOption => (
                      <option key={classOption._id} value={classOption._id}>
                        {classOption.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Endereço */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                    Rua
                  </label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.number" className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    id="address.number"
                    name="address.number"
                    value={formData.address.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.complement" className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="address.complement"
                    name="address.complement"
                    value={formData.address.complement}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="address.neighborhood"
                    name="address.neighborhood"
                    value={formData.address.neighborhood}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>
            
            {/* Responsáveis */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Responsáveis</h2>
                <button
                  type="button"
                  onClick={addGuardian}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Adicionar Responsável
                </button>
              </div>
              
              {formData.guardians.map((guardian, index) => (
                <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold">Responsável {index + 1}</h3>
                    {formData.guardians.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuardian(index)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Responsável
                      </label>
                      <input
                        type="text"
                        value={guardian.name}
                        onChange={(e) => handleGuardianChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parentesco
                      </label>
                      <input
                        type="text"
                        value={guardian.relationship}
                        onChange={(e) => handleGuardianChange(index, 'relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mãe, Pai, Avó, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={guardian.phoneNumber}
                        onChange={(e) => handleGuardianChange(index, 'phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={guardian.email}
                        onChange={(e) => handleGuardianChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`isMainContact-${index}`}
                        checked={guardian.isMainContact}
                        onChange={(e) => handleGuardianChange(index, 'isMainContact', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`isMainContact-${index}`} className="ml-2 block text-sm text-gray-900">
                        Contato Principal
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Observações */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Observações</h2>
              <div>
                <textarea
                  id="observations"
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Informações adicionais sobre o aluno..."
                />
              </div>
            </div>
            
            {/* Criar Usuário do Sistema */}
            {!isEditMode && (
              <div className="p-6 border-b">
                <div className="flex items-start mb-4">
                  <div className="flex items-center h-5">
                    <input
                      id="createUser"
                      name="createUser"
                      type="checkbox"
                      checked={formData.createUser}
                      onChange={handleCheckboxChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="createUser" className="font-medium text-gray-700">
                      Criar Usuário do Sistema
                    </label>
                    <p className="text-gray-500 text-sm">
                      Cria um usuário para o aluno acessar o sistema
                    </p>
                  </div>
                </div>
                
                {formData.createUser && (
                  <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Senha*
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={formData.createUser}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Botões de Ação */}
            <div className="p-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/alunos')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default StudentForm;