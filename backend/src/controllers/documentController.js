// backend/src/controllers/documentController.js
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const fs = require('fs');
const path = require('path');

// Upload de documento para aluno
exports.uploadStudentDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const { id } = req.params;
    const { documentType, documentName } = req.body;

    // Verificar se o aluno existe
    const student = await Student.findById(id);
    if (!student) {
      // Remover o arquivo se o aluno não existir
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    // Adicionar documento ao aluno
    const newDocument = {
      name: documentName || req.file.originalname,
      type: documentType || 'Outro',
      path: req.file.path.replace(/\\/g, '/'), // Normalizar caminho para URL
      uploadDate: new Date()
    };

    student.documents.push(newDocument);
    await student.save();

    res.status(200).json({ 
      message: 'Documento enviado com sucesso.', 
      document: newDocument 
    });
  } catch (error) {
    console.error('Erro ao enviar documento:', error);
    // Remover o arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Erro ao enviar documento.' });
  }
};

// Upload de foto para aluno
exports.uploadStudentPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma foto enviada.' });
    }

    const { id } = req.params;

    // Verificar se o aluno existe
    const student = await Student.findById(id);
    if (!student) {
      // Remover o arquivo se o aluno não existir
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    // Se já existe uma foto, remover o arquivo antigo
    if (student.photo && student.photo.path) {
      const oldPath = path.join(__dirname, '../../', student.photo.path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Atualizar foto do aluno
    student.photo = {
      path: req.file.path.replace(/\\/g, '/'), // Normalizar caminho para URL
      uploadDate: new Date()
    };

    await student.save();

    res.status(200).json({ 
      message: 'Foto enviada com sucesso.', 
      photo: student.photo 
    });
  } catch (error) {
    console.error('Erro ao enviar foto:', error);
    // Remover o arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Erro ao enviar foto.' });
  }
};

// Upload de documento para professor
exports.uploadTeacherDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const { id } = req.params;
    const { documentType, documentName } = req.body;

    // Verificar se o professor existe
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      // Remover o arquivo se o professor não existir
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    // Adicionar documento ao professor
    const newDocument = {
      name: documentName || req.file.originalname,
      type: documentType || 'Outro',
      path: req.file.path.replace(/\\/g, '/'), // Normalizar caminho para URL
      uploadDate: new Date()
    };

    teacher.documents.push(newDocument);
    await teacher.save();

    res.status(200).json({ 
      message: 'Documento enviado com sucesso.', 
      document: newDocument 
    });
  } catch (error) {
    console.error('Erro ao enviar documento:', error);
    // Remover o arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Erro ao enviar documento.' });
  }
};

// Upload de foto para professor
exports.uploadTeacherPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma foto enviada.' });
    }

    const { id } = req.params;

    // Verificar se o professor existe
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      // Remover o arquivo se o professor não existir
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    // Se já existe uma foto, remover o arquivo antigo
    if (teacher.photo && teacher.photo.path) {
      const oldPath = path.join(__dirname, '../../', teacher.photo.path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Atualizar foto do professor
    teacher.photo = {
      path: req.file.path.replace(/\\/g, '/'), // Normalizar caminho para URL
      uploadDate: new Date()
    };

    await teacher.save();

    res.status(200).json({ 
      message: 'Foto enviada com sucesso.', 
      photo: teacher.photo 
    });
  } catch (error) {
    console.error('Erro ao enviar foto:', error);
    // Remover o arquivo em caso de erro
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Erro ao enviar foto.' });
  }
};

// Excluir documento de aluno
exports.deleteStudentDocument = async (req, res) => {
  try {
    const { studentId, documentId } = req.params;

    // Verificar se o aluno existe
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    // Encontrar o documento
    const document = student.documents.id(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    // Remover o arquivo
    const filePath = path.join(__dirname, '../../', document.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remover o documento do array
    student.documents.pull(documentId);
    await student.save();

    res.status(200).json({ message: 'Documento excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    res.status(500).json({ message: 'Erro ao excluir documento.' });
  }
};

// Excluir documento de professor
exports.deleteTeacherDocument = async (req, res) => {
  try {
    const { teacherId, documentId } = req.params;

    // Verificar se o professor existe
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    // Encontrar o documento
    const document = teacher.documents.id(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Documento não encontrado.' });
    }

    // Remover o arquivo
    const filePath = path.join(__dirname, '../../', document.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remover o documento do array
    teacher.documents.pull(documentId);
    await teacher.save();

    res.status(200).json({ message: 'Documento excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir documento:', error);
    res.status(500).json({ message: 'Erro ao excluir documento.' });
  }
};