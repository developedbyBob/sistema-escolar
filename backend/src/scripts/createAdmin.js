// backend/src/scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Configurações do admin inicial
const adminData = {
  name: 'Administrador',
  email: 'admin@escola.com',
  password: 'admin123',
  role: 'admin'
};

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB Atlas');

    // Verificar se já existe um admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Um administrador já existe no sistema:', existingAdmin.email);
      process.exit(0);
    }

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Criar o admin
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    });

    await admin.save();
    console.log('Administrador criado com sucesso:');
    console.log('Email:', adminData.email);
    console.log('Senha:', adminData.password);
    console.log('IMPORTANTE: Altere essa senha após o primeiro login!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    process.exit(1);
  }
};

createAdmin();