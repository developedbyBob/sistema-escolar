// backend/src/controllers/academicRecordController.js
const AcademicRecord = require('../models/AcademicRecord');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Listar históricos escolares (com paginação e filtros)
exports.getAllRecords = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      studentId, 
      year, 
      grade,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;
    
    // Construir o filtro
    const filter = {};
    if (studentId) filter.student = studentId;
    if (year) filter.year = year;
    if (grade) filter.grade = grade;
    
    // Construir ordenação
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    // Contar total de registros com filtro
    const total = await AcademicRecord.countDocuments(filter);
    
    // Buscar históricos com paginação e filtros
    const records = await AcademicRecord.find(filter)
      .populate('student', 'name registrationNumber')
      .populate('classId', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.status(200).json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalRecords: total
    });
  } catch (error) {
    console.error('Erro ao listar históricos:', error);
    res.status(500).json({ message: 'Erro ao listar históricos escolares.' });
  }
};

// Obter histórico escolar por ID
exports.getRecordById = async (req, res) => {
  try {
    const record = await AcademicRecord.findById(req.params.id)
      .populate('student', 'name registrationNumber')
      .populate('classId', 'name')
      .populate('subjects.teacher', 'name');
    
    if (!record) {
      return res.status(404).json({ message: 'Histórico escolar não encontrado.' });
    }
    
    res.status(200).json(record);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de histórico inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao buscar histórico escolar.' });
  }
};

// Obter históricos escolares de um aluno
exports.getStudentRecords = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Verificar se o aluno existe
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }
    
    // Buscar todos os históricos do aluno
    const records = await AcademicRecord.find({ student: studentId })
      .populate('classId', 'name')
      .sort({ year: -1, createdAt: -1 });
    
    res.status(200).json(records);
  } catch (error) {
    console.error('Erro ao buscar históricos do aluno:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de aluno inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao buscar históricos do aluno.' });
  }
};

// Criar novo histórico escolar
exports.createRecord = async (req, res) => {
  try {
    const recordData = req.body;
    
    // Verificar se o aluno existe
    const student = await Student.findById(recordData.student);
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }
    
    // Verificar se já existe um histórico para este aluno neste ano e série
    const existingRecord = await AcademicRecord.findOne({
      student: recordData.student,
      year: recordData.year,
      grade: recordData.grade
    });
    
    if (existingRecord) {
      return res.status(400).json({ 
        message: 'Já existe um histórico para este aluno neste ano e série.' 
      });
    }
    
    // Criar o histórico escolar
    const academicRecord = new AcademicRecord(recordData);
    const savedRecord = await academicRecord.save();
    
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Erro ao criar histórico:', error);
    res.status(500).json({ message: 'Erro ao criar histórico escolar.' });
  }
};

// Atualizar histórico escolar
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar se o histórico existe
    const record = await AcademicRecord.findById(id);
    if (!record) {
      return res.status(404).json({ message: 'Histórico escolar não encontrado.' });
    }
    
    // Não permitir alterar o aluno
    if (updateData.student) {
      delete updateData.student;
    }
    
    // Atualizar dados do histórico
    const updatedRecord = await AcademicRecord.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Erro ao atualizar histórico:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de histórico inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao atualizar histórico escolar.' });
  }
};

// Atualizar notas e frequência de uma disciplina
exports.updateSubject = async (req, res) => {
  try {
    const { recordId, subjectId } = req.params;
    const updateData = req.body;
    
    // Verificar se o histórico existe
    const record = await AcademicRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Histórico escolar não encontrado.' });
    }
    
    // Encontrar a disciplina no array
    const subjectIndex = record.subjects.findIndex(
      subject => subject._id.toString() === subjectId
    );
    
    if (subjectIndex === -1) {
      return res.status(404).json({ message: 'Disciplina não encontrada neste histórico.' });
    }
    
    // Atualizar dados da disciplina
    Object.keys(updateData).forEach(key => {
      if (key === 'grades' || key === 'attendance') {
        Object.keys(updateData[key]).forEach(subKey => {
          record.subjects[subjectIndex][key][subKey] = updateData[key][subKey];
        });
      } else {
        record.subjects[subjectIndex][key] = updateData[key];
      }
    });
    
    // Recalcular a porcentagem de frequência
    if (updateData.attendance) {
      const { totalClasses, attendedClasses } = record.subjects[subjectIndex].attendance;
      if (totalClasses > 0 && attendedClasses >= 0) {
        record.subjects[subjectIndex].attendance.percentage = 
          (attendedClasses / totalClasses) * 100;
      }
    }
    
    // Calcular nota final se todas as notas bimestrais estiverem preenchidas
    if (updateData.grades) {
      const { firstTerm, secondTerm, thirdTerm, fourthTerm, recovery } = 
        record.subjects[subjectIndex].grades;
      
      if (firstTerm !== undefined && secondTerm !== undefined && 
          thirdTerm !== undefined && fourthTerm !== undefined) {
        
        // Média das notas bimestrais
        let finalGrade = (firstTerm + secondTerm + thirdTerm + fourthTerm) / 4;
        
        // Se houver recuperação e for maior que a média, usar a nota de recuperação
        if (recovery !== undefined && recovery > finalGrade) {
          finalGrade = recovery;
        }
        
        record.subjects[subjectIndex].grades.final = parseFloat(finalGrade.toFixed(1));
        
        // Atualizar status (aprovado/reprovado) baseado na nota final
        if (finalGrade >= 6) {
          record.subjects[subjectIndex].status = 'Aprovado';
        } else if (recovery !== undefined) {
          record.subjects[subjectIndex].status = 'Reprovado';
        } else {
          record.subjects[subjectIndex].status = 'Recuperação';
        }
      }
    }
    
    // Salvar as alterações
    await record.save();
    
    // Verificar se todas as disciplinas estão finalizadas para atualizar o resultado final
    const allSubjectsFinished = record.subjects.every(
      subject => subject.status === 'Aprovado' || subject.status === 'Reprovado'
    );
    
    if (allSubjectsFinished) {
      const hasFailedSubject = record.subjects.some(subject => subject.status === 'Reprovado');
      record.finalResult = hasFailedSubject ? 'Reprovado' : 'Aprovado';
      await record.save();
    }
    
    res.status(200).json(record);
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
    res.status(500).json({ message: 'Erro ao atualizar disciplina no histórico.' });
  }
};

// Adicionar nova disciplina ao histórico
exports.addSubject = async (req, res) => {
  try {
    const { recordId } = req.params;
    const subjectData = req.body;
    
    // Verificar se o histórico existe
    const record = await AcademicRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Histórico escolar não encontrado.' });
    }
    
    // Verificar se a disciplina já existe
    const subjectExists = record.subjects.some(
      subject => subject.subject === subjectData.subject
    );
    
    if (subjectExists) {
      return res.status(400).json({ message: 'Esta disciplina já existe neste histórico.' });
    }
    
    // Adicionar a disciplina
    record.subjects.push(subjectData);
    await record.save();
    
    res.status(200).json(record);
  } catch (error) {
    console.error('Erro ao adicionar disciplina:', error);
    res.status(500).json({ message: 'Erro ao adicionar disciplina ao histórico.' });
  }
};

// Remover disciplina do histórico
exports.removeSubject = async (req, res) => {
  try {
    const { recordId, subjectId } = req.params;
    
    // Verificar se o histórico existe
    const record = await AcademicRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Histórico escolar não encontrado.' });
    }
    
    // Encontrar a disciplina no array
    const subjectIndex = record.subjects.findIndex(
      subject => subject._id.toString() === subjectId
    );
    
    if (subjectIndex === -1) {
      return res.status(404).json({ message: 'Disciplina não encontrada neste histórico.' });
    }
    
    // Remover a disciplina
    record.subjects.splice(subjectIndex, 1);
    await record.save();
    
    res.status(200).json({ message: 'Disciplina removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover disciplina:', error);
    res.status(500).json({ message: 'Erro ao remover disciplina do histórico.' });
  }
};

// Deletar histórico escolar
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o histórico existe
    const record = await AcademicRecord.findById(id);
    if (!record) {
      return res.status(404).json({ message: 'Histórico escolar não encontrado.' });
    }
    
    // Excluir o histórico
    await AcademicRecord.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Histórico escolar excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir histórico:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de histórico inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao excluir histórico escolar.' });
  }
};