// frontend/src/pages/admin/AcademicRecordForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Menu from '../../components/Menu';

// Tipos
interface AcademicRecord {
  _id?: string;
  student: string;
  year: number;
  grade: string;
  classId?: string;
  subjects: {
    subject: string;
    teacher?: string;
    grades: {
      firstTerm?: number;
      secondTerm?: number;
      thirdTerm?: number;
      fourthTerm?: number;
      recovery?: number;
      final?: number;
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
              {isEditMode ? 'Editar Histórico Escolar' : 'Novo Histórico Escolar'}
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
                  <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                    Aluno*
                  </label>
                  <select
                    id="student"
                    name="student"
                    value={formData.student}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isEditMode || !!studentId}
                  >
                    <option value="">Selecione um aluno</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} ({student.registrationNumber})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Ano Letivo*
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="2000"
                    max="2100"
                  />
                </div>
                
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                    Série/Ano*
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="1º Ano - Fundamental">1º Ano - Fundamental</option>
                    <option value="2º Ano - Fundamental">2º Ano - Fundamental</option>
                    <option value="3º Ano - Fundamental">3º Ano - Fundamental</option>
                    <option value="4º Ano - Fundamental">4º Ano - Fundamental</option>
                    <option value="5º Ano - Fundamental">5º Ano - Fundamental</option>
                    <option value="6º Ano - Fundamental">6º Ano - Fundamental</option>
                    <option value="7º Ano - Fundamental">7º Ano - Fundamental</option>
                    <option value="8º Ano - Fundamental">8º Ano - Fundamental</option>
                    <option value="9º Ano - Fundamental">9º Ano - Fundamental</option>
                    <option value="1º Ano - Médio">1º Ano - Médio</option>
                    <option value="2º Ano - Médio">2º Ano - Médio</option>
                    <option value="3º Ano - Médio">3º Ano - Médio</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
                    Turma
                  </label>
                  <select
                    id="classId"
                    name="classId"
                    value={formData.classId || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} ({cls.year})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="finalResult" className="block text-sm font-medium text-gray-700 mb-1">
                    Resultado Final
                  </label>
                  <select
                    id="finalResult"
                    name="finalResult"
                    value={formData.finalResult}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Reprovado">Reprovado</option>
                    <option value="Transferido">Transferido</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Disciplinas */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Disciplinas</h2>
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Adicionar Disciplina
                </button>
              </div>
              
              {formData.subjects.length === 0 ? (
                <div className="bg-yellow-50 p-4 rounded border border-yellow-100 text-yellow-800">
                  Nenhuma disciplina adicionada. Clique no botão "Adicionar Disciplina" acima.
                </div>
              ) : (
                formData.subjects.map((subject, index) => (
                  <div key={index} className="mb-8 pb-6 border-b last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Disciplina {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Disciplina*
                        </label>
                        <select
                          value={subject.subject}
                          onChange={(e) => handleSubjectChange(index, 'subject', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Selecione</option>
                          {subjectsList.map((subj, i) => (
                            <option key={i} value={subj}>
                              {subj}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professor
                        </label>
                        <select
                          value={subject.teacher || ''}
                          onChange={(e) => handleSubjectChange(index, 'teacher', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione</option>
                          {teachers
                            .filter(teacher => 
                              !subject.subject || 
                              teacher.subjects.includes(subject.subject)
                            )
                            .map(teacher => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={subject.status}
                          onChange={(e) => handleSubjectChange(index, 'status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Em Andamento">Em Andamento</option>
                          <option value="Aprovado">Aprovado</option>
                          <option value="Reprovado">Reprovado</option>
                          <option value="Recuperação">Recuperação</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Notas</h4>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            1º Bimestre
                          </label>
                          <input
                            type="number"
                            value={subject.grades.firstTerm || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'grades.firstTerm', 
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="10"
                            step="0.1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            2º Bimestre
                          </label>
                          <input
                            type="number"
                            value={subject.grades.secondTerm || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'grades.secondTerm', 
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="10"
                            step="0.1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            3º Bimestre
                          </label>
                          <input
                            type="number"
                            value={subject.grades.thirdTerm || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'grades.thirdTerm', 
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="10"
                            step="0.1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            4º Bimestre
                          </label>
                          <input
                            type="number"
                            value={subject.grades.fourthTerm || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'grades.fourthTerm', 
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="10"
                            step="0.1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Recuperação
                          </label>
                          <input
                            type="number"
                            value={subject.grades.recovery || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'grades.recovery', 
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="10"
                            step="0.1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nota Final
                          </label>
                          <input
                            type="number"
                            value={subject.grades.final || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'grades.final', 
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="10"
                            step="0.1"
                            readOnly={false} // Idealmente seria calculado automaticamente
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Frequência</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Total de Aulas
                          </label>
                          <input
                            type="number"
                            value={subject.attendance.totalClasses || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'attendance.totalClasses', 
                              e.target.value ? parseInt(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Aulas Presentes
                          </label>
                          <input
                            type="number"
                            value={subject.attendance.attendedClasses || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'attendance.attendedClasses', 
                              e.target.value ? parseInt(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Porcentagem de Presença
                          </label>
                          <input
                            type="number"
                            value={subject.attendance.percentage || ''}
                            onChange={(e) => handleSubjectChange(
                              index, 
                              'attendance.percentage', 
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="100"
                            step="0.1"
                            readOnly={false} // Idealmente seria calculado automaticamente
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
                  placeholder="Informações adicionais sobre o histórico escolar..."
                />
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="p-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(studentId ? `/admin/alunos/${studentId}` : '/admin/alunos')}
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

export default AcademicRecordForm;