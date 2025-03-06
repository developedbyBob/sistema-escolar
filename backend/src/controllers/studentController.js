// backend/src/controllers/studentController.js
const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Helper para gerar número de matrícula único
const generateRegistrationNumber = async () => {
  const year = new Date().getFullYear().toString();
  // Buscar o último número de matrícula que começa com o ano atual
  const lastStudent = await Student.findOne({
    registrationNumber: new RegExp(`^${year}`)
  })
  .sort({ registrationNumber: -1 })
  .limit(1);
  
  if (!lastStudent) {
    return `${year}0001`; // Primeiro aluno do ano
  }
  
  // Extrair o número sequencial e incrementar
  const sequentialNumber = parseInt(lastStudent.registrationNumber.substring(4)) + 1;
  return `${year}${sequentialNumber.toString().padStart(4, '0')}`;
};

// Listar todos os alunos (com paginação e filtros)
exports.getAllStudents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      name, 
      status, 
      classId,
      sort = 'name',
      order = 'asc'
    } = req.query;
    
    // Construir o filtro
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (status) filter.status = status;
    if (classId) filter.currentClass = classId;
    
    // Construir ordenação
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    // Contar total de registros com filtro
    const total = await Student.countDocuments(filter);
    
    // Buscar alunos com paginação e filtros
    const students = await Student.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('currentClass', 'name year') // Popular referência à classe
      .select('-documents -photo'); // Não incluir documentos e fotos no resultado
    
    res.status(200).json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalStudents: total
    });
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ message: 'Erro ao listar alunos.' });
  }
};

// Obter aluno por ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('currentClass', 'name year')
      .populate('user', 'name email role'); // Popular referência ao usuário se existir
    
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }
    
    res.status(200).json(student);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de aluno inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao buscar aluno.' });
  }
};

// Criar novo aluno
exports.createStudent = async (req, res) => {
  try {
    const { createUser, ...studentData } = req.body;
    
    // Verificar se email já existe
    const existingStudent = await Student.findOne({ email: studentData.email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }
    
    // Verificar se CPF já existe (se fornecido)
    if (studentData.cpf) {
      const existingCpf = await Student.findOne({ cpf: studentData.cpf });
      if (existingCpf) {
        return res.status(400).json({ message: 'Este CPF já está cadastrado.' });
      }
    }
    
    // Gerar número de matrícula único
    const registrationNumber = await generateRegistrationNumber();
    studentData.registrationNumber = registrationNumber;
    
    // Criar usuário para o aluno, se solicitado
    if (createUser) {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: 'Senha é obrigatória para criar usuário.' });
      }
      
      // Gerar hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Criar usuário
      const newUser = new User({
        name: studentData.name,
        email: studentData.email,
        password: hashedPassword,
        role: 'student'
      });
      
      const savedUser = await newUser.save();
      
      // Associar ID do usuário ao aluno
      studentData.user = savedUser._id;
    }
    
    // Criar o aluno
    const student = new Student(studentData);
    const savedStudent = await student.save();
    
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    res.status(500).json({ message: 'Erro ao criar aluno.' });
  }
};

// Atualizar aluno
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar se o aluno existe
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }
    
    // Verificar se email está sendo alterado e se já existe
    if (updateData.email && updateData.email !== student.email) {
      const existingEmail = await Student.findOne({ email: updateData.email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Este email já está em uso.' });
      }
    }
    
    // Verificar se CPF está sendo alterado e se já existe
    if (updateData.cpf && updateData.cpf !== student.cpf) {
      const existingCpf = await Student.findOne({ cpf: updateData.cpf, _id: { $ne: id } });
      if (existingCpf) {
        return res.status(400).json({ message: 'Este CPF já está cadastrado.' });
      }
    }
    
    // Não permitir alterar o número de matrícula
    if (updateData.registrationNumber) {
      delete updateData.registrationNumber;
    }
    
    // Atualizar usuário associado, se existir
    if (student.user && updateData.email) {
      await User.findByIdAndUpdate(student.user, { email: updateData.email });
    }
    
    // Atualizar dados do aluno
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de aluno inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao atualizar aluno.' });
  }
};

// Deletar aluno
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o aluno existe
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }
    
    // Excluir usuário associado, se existir
    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }
    
    // Excluir o aluno
    await Student.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Aluno excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de aluno inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao excluir aluno.' });
  }
};

// Buscar alunos por nome ou matrícula (para auto-complete)
exports.searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'A consulta deve ter pelo menos 2 caracteres.' });
    }
    
    const students = await Student.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { registrationNumber: new RegExp(query, 'i') }
      ]
    })
    .limit(10)
    .select('name registrationNumber');
    
    res.status(200).json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro ao buscar alunos.' });
  }
};