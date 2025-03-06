// frontend/src/pages/admin/TeacherDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Menu from "../../components/Menu";

// Tipos
interface Teacher {
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
  employeeId: string;
  status: string;
  hireDate: string;
  education?: {
    degree: string;
    institution: string;
    graduationYear: number;
  };
  specialization?: string[];
  subjects: string[];
  contractType?: string;
  classes?: {
    _id: string;
    name: string;
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

const TeacherDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("info");

  // Carregar dados do professor
  useEffect(() => {
    const fetchTeacherData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Buscar dados do professor
        const teacherResponse = await axios.get(
          `http://localhost:5000/api/teachers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setTeacher(teacherResponse.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Erro ao carregar dados do professor"
        );
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
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
      case "Afastado":
        return "bg-yellow-100 text-yellow-800";
      case "Desligado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Formatar endereço completo
  const formatAddress = (address: Teacher["address"]) => {
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

  // Excluir professor
  const handleDeleteTeacher = async () => {
    if (!teacher) return;

    if (
      window.confirm(`Tem certeza que deseja excluir o professor ${teacher.name}?`)
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/teachers/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Redirecionar para a lista de professores
        navigate("/admin/professores");
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao excluir professor");
        console.error("Erro ao excluir professor:", err);
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
                Detalhes do Professor
              </h1>
            </div>

          {/* Botões de ação */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate("/admin/professores")}
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

export default TeacherDetails;
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
                Detalhes do Professor
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate("/admin/professores")}
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

  if (!teacher) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Menu />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800">
                Detalhes do Professor
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Professor não encontrado.
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate("/admin/professores")}
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
              Detalhes do Professor
            </h1>
            <div className="flex space-x-2">
              <Link
                to={`/admin/professores/editar/${id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </Link>
              <button
                onClick={handleDeleteTeacher}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Cabeçalho do Professor */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 md:mr-6 mb-4 md:mb-0">
                  <div className="h-32 w-32 bg-gray-200 rounded-full overflow-hidden">
                    {teacher.photo ? (
                      <img
                        src={`http://localhost:5000/${teacher.photo.path}`}
                        alt={teacher.name}
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
                      {teacher.name}
                    </h2>
                    <span
                      className={`ml-3 px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        teacher.status
                      )}`}
                    >
                      {teacher.status}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        ID Funcionário:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {teacher.employeeId}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Tipo de Contrato:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {teacher.contractType || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Email:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {teacher.email}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Telefone:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {teacher.phoneNumber || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Data de Contratação:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(teacher.hireDate)}
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Usuário do Sistema:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {teacher.user ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                </div>