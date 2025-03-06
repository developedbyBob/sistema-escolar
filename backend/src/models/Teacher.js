// backend/src/models/Teacher.js
const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  // Informações básicas
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  dateOfBirth: { 
    type: Date 
  },
  gender: { 
    type: String, 
    enum: ['Masculino', 'Feminino', 'Outro'] 
  },
  cpf: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  rg: { 
    type: String 
  },
  
  // Informações de contato
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String
  },
  phoneNumber: String,
  
  // Informações profissionais
  employeeId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  education: {
    degree: String,
    institution: String,
    graduationYear: Number
  },
  specialization: [String],
  hireDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Ativo', 'Afastado', 'Desligado'], 
    default: 'Ativo' 
  },
  
  // Áreas e disciplinas de atuação
  subjects: [{
    type: String
  }],
  
  // Classes atribuídas ao professor
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  
  // Documentos e foto
  documents: [{
    name: String,
    type: String, // 'Diploma', 'Certificado', 'RG', 'CPF', etc.
    path: String,
    uploadDate: { 
      type: Date, 
      default: Date.now 
    }
  }],
  photo: {
    path: String,
    uploadDate: Date
  },
  
  // Informações trabalhistas
  workSchedule: {
    monday: [{ startTime: String, endTime: String }],
    tuesday: [{ startTime: String, endTime: String }],
    wednesday: [{ startTime: String, endTime: String }],
    thursday: [{ startTime: String, endTime: String }],
    friday: [{ startTime: String, endTime: String }],
    saturday: [{ startTime: String, endTime: String }]
  },
  contractType: {
    type: String,
    enum: ['CLT', 'PJ', 'Temporário', 'Outro']
  },
  
  // Informações adicionais
  observations: String,
  
  // Vinculo com usuário do sistema
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // Campos de controle
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Atualiza automaticamente createdAt e updatedAt
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;