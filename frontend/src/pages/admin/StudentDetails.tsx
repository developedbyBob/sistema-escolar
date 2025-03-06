// frontend/src/pages/admin/StudentDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Menu from "../../components/Menu";

// Tipos
interface Student {
  _id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  cpf?: string;
  rg?: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phoneNumber?: string;
  registrationNumber: string;
  status: string;
  currentClass?: {
    _id: string;
    name: string;
  };
  guardians: {
    _id: string;
    name: string;
    relationship: string;
    phoneNumber: string;
    email: string;
    isMainContact: boolean;
  }[];
  observations?: string;
  photo?: {
    path: string;
    uploadDate: string;
  };
  documents?: {
    _id: string;
    name: string;
    type: string;
    path: string;
    uploadDate: string;
  }[];
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface AcademicRecord {
  _id: string;
  year: number;
  grade: string;
  classId?: {
    _id: string;
    name: string;
  };
  finalResult: string;
  createdAt: string;
}

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("info");

  // Carregar dados do aluno
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Buscar dados do aluno
        const studentResponse = await axios.get(
          `http://localhost:5000/api/students/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setStudent(studentResponse.data);

        // Buscar histórico escolar do aluno
        const recordsResponse = await axios.get(
          `http://localhost:5000/api/academic-records/student/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setAcademicRecords(recordsResponse.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Erro ao carregar dados do aluno"
        );
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Formatar status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Inativo":
        return "bg-red-100 text-red-800";
      case "Transferido":
        return "bg-yellow-100 text-yellow-800";
      case "Formado":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Formatar endereço completo
  const formatAddress = (address: Student["address"]) => {
    const parts = [];

    if (address.street) {
      parts.push(`${address.street}, ${address.number || "S/N"}`);
    }

    if (address.complement) {
      parts.push(address.complement);
    }

    if (address.neighborhood) {
      parts.push(address.neighborhood);
    }

    const cityState = [];
    if (address.city) cityState.push(address.city);
    if (address.state) cityState.push(address.state);

    if (cityState.length > 0) {
      parts.push(cityState.join(" - "));
    }

    if (address.zipCode) {
      parts.push(`CEP: ${address.zipCode}`);
    }

    return parts.join(", ") || "Endereço não cadastrado";
  };

  // Excluir aluno
  const handleDeleteStudent = async () => {
    if (!student) return;

    if (
      window.confirm(`Tem certeza que deseja excluir o aluno ${student.name}?`)
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Redirecionar para a lista de alunos
        navigate("/admin/alunos");
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao excluir aluno");
        console.error("Erro ao excluir aluno:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Menu />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Detalhes do Aluno
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Menu />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Detalhes do Aluno
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate("/admin/alunos")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Voltar para Lista
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Menu />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Detalhes do Aluno
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Aluno não encontrado.
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate("/admin/alunos")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Voltar para Lista
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Menu />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Detalhes do Aluno
            </h1>
            <div className="flex space-x-2">
              <Link
                to={`/admin/alunos/editar/${id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </Link>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Cabeçalho do Aluno */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 md:mr-6 mb-4 md:mb-0">
                  <div className="h-32 w-32 bg-gray-200 rounded-full overflow-hidden">
                    {student.photo ? (
                      <img
                        src={`http://localhost:5000/${student.photo.path}`}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                        Sem Foto
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {student.name}
                    </h2>
                    <span
                      className={`ml-3 px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Matrícula:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {student.registrationNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Turma:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {student.currentClass?.name || "Sem turma"}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Email:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {student.email}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Telefone:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {student.phoneNumber || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Data de Nascimento:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(student.dateOfBirth)}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Usuário do Sistema:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {student.user ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Abas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === "info"
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("info")}
                >
                  Informações Pessoais
                </button>
                <button
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === "guardians"
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("guardians")}
                >
                  Responsáveis
                </button>
                <button
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === "records"
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("records")}
                >
                  Histórico Escolar
                </button>
                <button
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === "documents"
                      ? "text-blue-600 border-b-2 border-blue-500"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("documents")}
                >
                  Documentos
                </button>
              </nav>
            </div>

            {/* Conteúdo da aba "Informações Pessoais" */}
            {activeTab === "info" && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Dados Pessoais
                    </h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <div className="grid grid-cols-1 gap-y-2">
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Nome:
                          </span>
                          <span className="text-sm text-gray-900">
                            {student.name}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Email:
                          </span>
                          <span className="text-sm text-gray-900">
                            {student.email}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Matrícula:
                          </span>
                          <span className="text-sm text-gray-900">
                            {student.registrationNumber}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Data de Nasc.:
                          </span>
                          <span className="text-sm text-gray-900">
                            {formatDate(student.dateOfBirth)}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Gênero:
                          </span>
                          <span className="text-sm text-gray-900">
                            {student.gender || "-"}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            CPF:
                          </span>
                          <span className="text-sm text-gray-900">
                            {student.cpf || "-"}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            RG:
                          </span>
                          <span className="text-sm text-gray-900">
                            {student.rg || "-"}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Telefone:
                          </span>
                          <span className="text-sm text-gray-900">
                            {student.phoneNumber || "-"}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Status:
                          </span>
                          <span
                            className={`text-sm px-2 rounded-full ${getStatusBadgeClass(
                              student.status
                            )}`}
                          >
                            {student.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Endereço</h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <div className="grid grid-cols-1 gap-y-2">
                        <div className="flex">
                          <span className="text-sm font-medium text-gray-500 w-32">
                            Endereço:
                          </span>
                          <span className="text-sm text-gray-900">
                            {formatAddress(student.address)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3 mt-6">
                      Observações
                    </h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-sm text-gray-900">
                        {student.observations || "Sem observações."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo da aba "Responsáveis" */}
            {activeTab === "guardians" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Responsáveis</h3>

                {student.guardians.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm text-gray-700">
                      Nenhum responsável cadastrado.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {student.guardians.map((guardian, index) => (
                      <div
                        key={guardian._id || index}
                        className="bg-gray-50 p-4 rounded border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{guardian.name}</h4>
                          {guardian.isMainContact && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Contato Principal
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-y-2">
                          <div className="flex">
                            <span className="text-sm font-medium text-gray-500 w-32">
                              Parentesco:
                            </span>
                            <span className="text-sm text-gray-900">
                              {guardian.relationship || "-"}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-sm font-medium text-gray-500 w-32">
                              Telefone:
                            </span>
                            <span className="text-sm text-gray-900">
                              {guardian.phoneNumber || "-"}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-sm font-medium text-gray-500 w-32">
                              Email:
                            </span>
                            <span className="text-sm text-gray-900">
                              {guardian.email || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Conteúdo da aba "Histórico Escolar" */}
            {activeTab === "records" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Histórico Escolar</h3>
                  <Link
                    to={`/admin/historico/novo?studentId=${id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Adicionar Histórico
                  </Link>
                </div>

                {academicRecords.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm text-gray-700">
                      Nenhum registro acadêmico encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ano
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Série/Ano
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Turma
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Resultado
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {academicRecords.map((record) => (
                          <tr key={record._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.grade}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.classId?.name || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  record.finalResult === "Aprovado"
                                    ? "bg-green-100 text-green-800"
                                    : record.finalResult === "Reprovado"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {record.finalResult}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                to={`/admin/historico/${record._id}`}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                Detalhes
                              </Link>
                              <Link
                                to={`/admin/historico/editar/${record._id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Editar
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Conteúdo da aba "Documentos" */}
            {activeTab === "documents" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Documentos</h3>
                  <Link
                    to={`/admin/alunos/${id}/documentos/upload`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Adicionar Documento
                  </Link>
                </div>

                {!student.documents || student.documents.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-sm text-gray-700">
                      Nenhum documento cadastrado.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {student.documents.map((document) => (
                      <div
                        key={document._id}
                        className="bg-gray-50 p-4 rounded border border-gray-200"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{document.name}</h4>
                          <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                            {document.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Adicionado em: {formatDate(document.uploadDate)}
                        </p>
                        <div className="flex justify-between items-center">
                          <a
                            href={`http://localhost:5000/${document.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Visualizar
                          </a>
                          <button
                            className="text-red-600 hover:text-red-800 text-sm"
                            onClick={() => {
                              alert(
                                "Funcionalidade de exclusão de documento a ser implementada"
                              );
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Foto do Aluno</h3>
                    <Link
                      to={`/admin/alunos/${id}/foto/upload`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      {student.photo ? "Atualizar Foto" : "Adicionar Foto"}
                    </Link>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    {student.photo ? (
                      <div className="flex flex-col md:flex-row items-center">
                        <div className="h-40 w-40 bg-gray-200 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                          <img
                            src={`http://localhost:5000/${student.photo.path}`}
                            alt={student.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 mb-2">
                            Foto adicionada em:{" "}
                            {formatDate(student.photo.uploadDate)}
                          </p>
                          <button
                            className="text-red-600 hover:text-red-800 text-sm"
                            onClick={() => {
                              alert(
                                "Funcionalidade de exclusão de foto a ser implementada"
                              );
                            }}
                          >
                            Remover Foto
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700">
                        Nenhuma foto cadastrada. Clique em "Adicionar Foto" para
                        incluir uma foto do aluno.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/admin/alunos")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Voltar para Lista
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDetails;
