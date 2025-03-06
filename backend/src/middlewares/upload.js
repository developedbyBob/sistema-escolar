// backend/src/middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Diretório base para uploads
const uploadDir = path.join(__dirname, '../../uploads');

// Criar diretório de uploads se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    
    // Verificar qual tipo de arquivo está sendo enviado
    if (req.originalUrl.includes('/photo')) {
      folder = 'photos';
    }
    
    // Criar pasta específica se não existir
    const destFolder = path.join(uploadDir, folder);
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }
    
    cb(null, destFolder);
  },
  filename: (req, file, cb) => {
    // Gerar nome de arquivo único para evitar sobrescrita
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    // Formato: [ID da entidade]-[timestamp]-[tipo]-[número aleatório].[extensão]
    cb(null, `${req.params.id}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  // Verificar se é uma foto
  if (req.originalUrl.includes('/photo')) {
    // Aceitar apenas imagens
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas!'), false);
    }
  } else {
    // Para documentos, aceitar tipos comuns de documentos
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Formato de arquivo não permitido!'), false);
    }
  }
  
  cb(null, true);
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Limite de 10MB
  }
});

module.exports = upload;