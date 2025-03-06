// frontend/src/pages/admin/TeacherForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Menu from '../../components/Menu';

// Tipos
interface Teacher {
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
  education: {
    degree: string;
    institution: string;
    graduationYear: number | string;
  };
  specialization: string[];
  subjects: string[];
  contractType: string;
  observations: string;
  createUser?: boolean;
  password?: string;
}

const TeacherForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Estado para o formulário
  const [formData, setFormData] = useState<Teacher>({
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
    education: {
      degree: '',
      institution: '',
      graduationYear: ''
    },
    specialization: [''],
    subjects: [''],
    contractType: 'CLT',
    observations: '',
    createUser: false,
    password: ''
  });

  // Estados auxiliares
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Carregar dados do professor (modo edição)
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);

      axios.get(`http://localhost:5000/api/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          // Ajustar data de nascimento para o formato de entrada de data (YYYY-MM-DD)
          const teacher = response.data;
          if (teacher.dateOfBirth) {
            teacher.dateOfBirth = new Date(teacher.dateOfBirth).toISOString().split('T')[0];
          }

          // Se não houver especialização ou disciplinas, inicializar com array vazio
          if (!teacher.specialization || teacher.specialization.length === 0) {
            teacher.specialization = [''];
          }
          if (!teacher.subjects || teacher.subjects.length === 0) {
            teacher.subjects = [''];
          }

          // Garantir que education existe
          if (!teacher.education) {
            teacher.education = {
              degree: '',
              institution: '',
              graduationYear: ''
            };
          }

          setFormData(teacher);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Erro ao carregar dados do professor');
          console.error('Erro ao carregar dados:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  // Manipular mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Verificar se é um campo aninhado (com ".")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof Teacher],
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

  // Manipular arrays de disciplinas
  const handleSubjectChange = (index: number, value: string) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = value;
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  // Adicionar campo de disciplina
  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, '']
    });
  };

  // Remover campo de disciplina
  const removeSubject = (index: number) => {
    if (formData.subjects.length <= 1) {
      return;
    }
    const updatedSubjects = [...formData.subjects];
    updatedSubjects.splice(index, 1);
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  // Manipular arrays de especialização
  const handleSpecializationChange = (index: number, value: string) => {
    const updatedSpecializations = [...formData.specialization];
    updatedSpecializations[index] = value;
    setFormData({
      ...formData,
      specialization: updatedSpecializations
    });
  };

  // Adicionar campo de especialização
  const addSpecialization = () => {
    setFormData({
      ...formData,
      specialization: [...formData.specialization, '']
    });
  };

  // Remover campo de especialização
  const removeSpecialization = (index: number) => {
    if (formData.specialization.length <= 1) {
      return;
    }
    const updatedSpecializations = [...formData.specialization];
    updatedSpecializations.splice(index, 1);
    setFormData({
      ...formData,
      specialization: updatedSpecializations
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

      // Filtrar campos vazios de arrays
      dataToSend.subjects = dataToSend.subjects.filter(subject => subject.trim() !== '');
      dataToSend.specialization = dataToSend.specialization.filter(spec => spec.trim() !== '');

      // Remover password se não for criar usuário
      if (!dataToSend.createUser) {
        delete dataToSend.password;
      }

      if (isEditMode) {
        // Modo de edição
        await axios.put(`http://localhost:5000/api/teachers/${id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setSuccess('Professor atualizado com sucesso!');

        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/admin/professores');
        }, 2000);
      } else {
        // Modo de criação
        await axios.post('http://localhost:5000/api/teachers', dataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setSuccess('Professor cadastrado com sucesso!');

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
          education: {
            degree: '',
            institution: '',
            graduationYear: ''
          },
          specialization: [''],
          subjects: [''],
          contractType: 'CLT',
          observations: '',
          createUser: false,
          password: ''
        });

        setTimeout(() => {
          navigate('/admin/professores');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar professor');
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
              {isEditMode ? 'Editar Professor' : 'Novo Professor'}
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
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500">              </div>
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
            
            {/* Formação e Especialização */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Formação e Especialização</h2>
              
              {/* Formação */}
              <h3 className="font-medium text-gray-700 mb-2">Formação Acadêmica</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="education.degree" className="block text-sm font-medium text-gray-700 mb-1">
                    Grau Acadêmico
                  </label>
                  <input
                    type="text"
                    id="education.degree"
                    name="education.degree"
                    value={formData.education.degree}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Licenciatura em Matemática"
                  />
                </div>
                
                <div>
                  <label htmlFor="education.institution" className="block text-sm font-medium text-gray-700 mb-1">
                    Instituição
                  </label>
                  <input
                    type="text"
                    id="education.institution"
                    name="education.institution"
                    value={formData.education.institution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="education.graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Ano de Conclusão
                  </label>
                  <input
                    type="number"
                    id="education.graduationYear"
                    name="education.graduationYear"
                    value={formData.education.graduationYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ano"
                  />
                </div>
              </div>
              
              {/* Especialização */}
              <h3 className="font-medium text-gray-700 mb-2">Especializações</h3>
              {formData.specialization.map((spec, index) => (
                <div key={index} className="flex mb-2 gap-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => handleSpecializationChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Mestrado em Educação"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    disabled={formData.specialization.length <= 1}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecialization}
                className="mt-2 px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
              >
                + Adicionar Especialização
              </button>
            </div>
            
            {/* Disciplinas */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Disciplinas</h2>
              </div>
              
              {formData.subjects.map((subject, index) => (
                <div key={index} className="flex mb-2 gap-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Matemática"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    disabled={formData.subjects.length <= 1}
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSubject}
                className="mt-2 px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
              >
                + Adicionar Disciplina
              </button>
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
                  placeholder="Informações adicionais sobre o professor..."
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
                      Cria um usuário para o professor acessar o sistema
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
                    <option value="Afastado">Afastado</option>
                    <option value="Desligado">Desligado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contractType" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Contrato
                  </label>
                  <select
                    id="contractType"
                    name="contractType"
                    value={formData.contractType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>