// backend/src/routes/academicRecords.js
const express = require('express');
const router = express.Router();
const academicRecordController = require('../controllers/academicRecordController');
const { authenticate, authorize } = require('../middlewares/auth');

// Middleware de autenticação para todas as rotas
router.use(authenticate);

// Listar todos os históricos (com paginação e filtros)
router.get('/', authorize('admin', 'teacher'), academicRecordController.getAllRecords);

// Obter histórico por ID
router.get('/:id', authorize('admin', 'teacher', 'student'), academicRecordController.getRecordById);

// Obter históricos de um aluno específico
router.get('/student/:studentId', authorize('admin', 'teacher', 'student'), academicRecordController.getStudentRecords);

// Criar novo histórico (apenas admin e professores)
router.post('/', authorize('admin', 'teacher'), academicRecordController.createRecord);

// Atualizar histórico (apenas admin e professores)
router.put('/:id', authorize('admin', 'teacher'), academicRecordController.updateRecord);

// Adicionar disciplina ao histórico
router.post('/:recordId/subjects', authorize('admin', 'teacher'), academicRecordController.addSubject);

// Atualizar disciplina do histórico
router.put('/:recordId/subjects/:subjectId', authorize('admin', 'teacher'), academicRecordController.updateSubject);

// Remover disciplina do histórico
router.delete('/:recordId/subjects/:subjectId', authorize('admin', 'teacher'), academicRecordController.removeSubject);

// Excluir histórico (apenas admin)
router.delete('/:id', authorize('admin'), academicRecordController.deleteRecord);

module.exports = router;