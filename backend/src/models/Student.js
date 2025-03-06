// backend/src/models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
    sparse: true // Permite que seja nulo e ainda mantém o índice único
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
  
  // Informações acadêmicas
  registrationNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  currentClass: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class' 
  },
  enrollmentDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Ativo', 'Inativo', 'Transferido', 'Formado'], 
    default: 'Ativo' 
  },
  
  // Informações dos responsáveis
  guardians: [{
    name: String,
    relationship: String,
    phoneNumber: String,
    email: String,
    isMainContact: Boolean
  }],
  
  // Documentos e fotos
  documents: [{
    name: String,
    type: String, // 'RG', 'CPF', 'Comprovante de Residência', etc.
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
  
  // Informações médicas
  bloodType: String,
  allergies: [String],
  medications: [String],
  specialNeeds: String,
  
  // Informações adicionais
  observations: String,
  
  // Vinculo com usuário do sistema (se aplicável)
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

// Método para obter a idade do aluno
studentSchema.methods.getAge = function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;