// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar o token JWT
exports.authenticate = async (req, res, next) => {
  try {
    // Verificar se o token existe no cabeçalho de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar o usuário pelo ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

// Middleware para verificar permissões de acesso
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Acesso proibido. Você não tem permissão para esta ação.' 
      });
    }

    next();
  };
};