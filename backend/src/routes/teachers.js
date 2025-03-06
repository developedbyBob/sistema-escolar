// backend/src/routes/teachers.js
const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const documentController = require('../controllers/documentController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Middleware de autenticação para todas as rotas
router.use(authenticate);

// Rota de busca (autocompletar) - acessível por admin e professores
router.get('/search', authorize('admin', 'teacher'), teacherController.searchTeachers);

// Rota para listar disciplinas disponíveis
router.get('/subjects', authorize('admin', 'teacher', 'student'), teacherController.listSubjects);

// Listar todos os professores (com paginação e filtros)
router.get('/', authorize('admin', 'teacher'), teacherController.getAllTeachers);

// Obter professor por ID
router.get('/:id', authorize('admin', 'teacher'), teacherController.getTeacherById);

// Criar novo professor (apenas admin)
router.post('/', authorize('admin'), teacherController.createTeacher);

// Atualizar professor (apenas admin)
router.put('/:id', authorize('admin'), teacherController.updateTeacher);

// Excluir professor (apenas admin)
router.delete('/:id', authorize('admin'), teacherController.deleteTeacher);

// Rotas para documentos e fotos
router.post('/:id/documents', authorize('admin'), upload.single('document'), documentController.uploadTeacherDocument);
router.post('/:id/photo', authorize('admin'), upload.single('photo'), documentController.uploadTeacherPhoto);
router.delete('/:teacherId/documents/:documentId', authorize('admin'), documentController.deleteTeacherDocument);

module.exports = router;