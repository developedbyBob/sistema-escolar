// backend/src/controllers/teacherController.js
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Helper para gerar ID de funcionário único
const generateEmployeeId = async () => {
  const year = new Date().getFullYear().toString().substring(2); // Últimos 2 dígitos do ano
  // Buscar o último ID de funcionário que começa com os dígitos do ano atual
  const lastTeacher = await Teacher.findOne({
    employeeId: new RegExp(`^P${year}`)
  })
  .sort({ employeeId: -1 })
  .limit(1);
  
  if (!lastTeacher) {
    return `P${year}001`; // Primeiro professor do ano
  }
  
  // Extrair o número sequencial e incrementar
  const sequentialNumber = parseInt(lastTeacher.employeeId.substring(3)) + 1;
  return `P${year}${sequentialNumber.toString().padStart(3, '0')}`;
};

// Listar todos os professores (com paginação e filtros)
exports.getAllTeachers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      name, 
      status, 
      subject,
      sort = 'name',
      order = 'asc'
    } = req.query;
    
    // Construir o filtro
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (status) filter.status = status;
    if (subject) filter.subjects = subject;
    
    // Construir ordenação
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;
    
    // Contar total de registros com filtro
    const total = await Teacher.countDocuments(filter);
    
    // Buscar professores com paginação e filtros
    const teachers = await Teacher.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email role')
      .select('-documents -photo'); // Não incluir documentos e fotos no resultado
    
    res.status(200).json({
      teachers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalTeachers: total
    });
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ message: 'Erro ao listar professores.' });
  }
};

// Obter professor por ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('classes', 'name year')
      .populate('user', 'name email role');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }
    
    res.status(200).json(teacher);
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de professor inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao buscar professor.' });
  }
};

// Criar novo professor
exports.createTeacher = async (req, res) => {
  try {
    const { createUser, ...teacherData } = req.body;
    
    // Verificar se email já existe
    const existingTeacher = await Teacher.findOne({ email: teacherData.email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }
    
    // Verificar se CPF já existe (se fornecido)
    if (teacherData.cpf) {
      const existingCpf = await Teacher.findOne({ cpf: teacherData.cpf });
      if (existingCpf) {
        return res.status(400).json({ message: 'Este CPF já está cadastrado.' });
      }
    }
    
    // Gerar ID de funcionário único
    const employeeId = await generateEmployeeId();
    teacherData.employeeId = employeeId;
    
    // Criar usuário para o professor, se solicitado
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
        name: teacherData.name,
        email: teacherData.email,
        password: hashedPassword,
        role: 'teacher'
      });
      
      const savedUser = await newUser.save();
      
      // Associar ID do usuário ao professor
      teacherData.user = savedUser._id;
    }
    
    // Criar o professor
    const teacher = new Teacher(teacherData);
    const savedTeacher = await teacher.save();
    
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    res.status(500).json({ message: 'Erro ao criar professor.' });
  }
};

// Atualizar professor
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar se o professor existe
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }
    
    // Verificar se email está sendo alterado e se já existe
    if (updateData.email && updateData.email !== teacher.email) {
      const existingEmail = await Teacher.findOne({ email: updateData.email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ message: 'Este email já está em uso.' });
      }
    }
    
    // Verificar se CPF está sendo alterado e se já existe
    if (updateData.cpf && updateData.cpf !== teacher.cpf) {
      const existingCpf = await Teacher.findOne({ cpf: updateData.cpf, _id: { $ne: id } });
      if (existingCpf) {
        return res.status(400).json({ message: 'Este CPF já está cadastrado.' });
      }
    }
    
    // Não permitir alterar o ID de funcionário
    if (updateData.employeeId) {
      delete updateData.employeeId;
    }
    
    // Atualizar usuário associado, se existir
    if (teacher.user && updateData.email) {
      await User.findByIdAndUpdate(teacher.user, { email: updateData.email });
    }
    
    // Atualizar dados do professor
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedTeacher);
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de professor inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao atualizar professor.' });
  }
};

// Deletar professor
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o professor existe
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }
    
    // Excluir usuário associado, se existir
    if (teacher.user) {
      await User.findByIdAndDelete(teacher.user);
    }
    
    // Excluir o professor
    await Teacher.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Professor excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir professor:', error);
    
    // Verificar se o erro é de ID inválido
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'ID de professor inválido.' });
    }
    
    res.status(500).json({ message: 'Erro ao excluir professor.' });
  }
};

// Buscar professores por nome ou disciplina (para auto-complete)
exports.searchTeachers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'A consulta deve ter pelo menos 2 caracteres.' });
    }
    
    const teachers = await Teacher.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { subjects: new RegExp(query, 'i') }
      ]
    })
    .limit(10)
    .select('name subjects employeeId');
    
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    res.status(500).json({ message: 'Erro ao buscar professores.' });
  }
};

// Listar disciplinas disponíveis
exports.listSubjects = async (req, res) => {
  try {
    // Agregar todas as disciplinas únicas de todos os professores
    const subjects = await Teacher.aggregate([
      { $unwind: '$subjects' },
      { $group: { _id: '$subjects' } },
      { $sort: { _id: 1 } }
    ]);
    
    const subjectList = subjects.map(item => item._id);
    
    res.status(200).json(subjectList);
  } catch (error) {
    console.error('Erro ao listar disciplinas:', error);
    res.status(500).json({ message: 'Erro ao listar disciplinas.' });
  }
};