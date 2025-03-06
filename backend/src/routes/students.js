// backend/src/routes/students.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const documentController = require('../controllers/documentController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Middleware de autenticação para todas as rotas
router.use(authenticate);

// Rota de busca (autocompletar) - acessível por admin e professores
router.get('/search', authorize('admin', 'teacher'), studentController.searchStudents);

// Listar todos os alunos (com paginação e filtros)
router.get('/', authorize('admin', 'teacher'), studentController.getAllStudents);

// Obter aluno por ID
router.get('/:id', authorize('admin', 'teacher', 'student'), studentController.getStudentById);

// Criar novo aluno (apenas admin)
router.post('/', authorize('admin'), studentController.createStudent);

// Atualizar aluno (apenas admin)
router.put('/:id', authorize('admin'), studentController.updateStudent);

// Excluir aluno (apenas admin)
router.delete('/:id', authorize('admin'), studentController.deleteStudent);

// Rotas para documentos e fotos
router.post('/:id/documents', authorize('admin'), upload.single('document'), documentController.uploadStudentDocument);
router.post('/:id/photo', authorize('admin'), upload.single('photo'), documentController.uploadStudentPhoto);
router.delete('/:studentId/documents/:documentId', authorize('admin'), documentController.deleteStudentDocument);

module.exports = router;