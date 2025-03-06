// backend/src/models/AcademicRecord.js
const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  grades: {
    firstTerm: Number,
    secondTerm: Number,
    thirdTerm: Number,
    fourthTerm: Number,
    recovery: Number,
    final: Number
  },
  attendance: {
    totalClasses: Number,
    attendedClasses: Number,
    percentage: Number
  },
  status: {
    type: String,
    enum: ['Aprovado', 'Reprovado', 'Em Andamento', 'Recuperação'],
    default: 'Em Andamento'
  }
});

const academicRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  school: {
    name: String,
    address: String,
    cnpj: String,
    phone: String
  },
  year: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  subjects: [gradeSchema],
  finalResult: {
    type: String,
    enum: ['Aprovado', 'Reprovado', 'Transferido', 'Em Andamento'],
    default: 'Em Andamento'
  },
  observations: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Método para calcular a média geral do aluno
academicRecordSchema.methods.calculateOverallAverage = function() {
  if (!this.subjects || this.subjects.length === 0) {
    return 0;
  }
  
  let totalGrade = 0;
  let count = 0;
  
  this.subjects.forEach(subject => {
    if (subject.grades.final) {
      totalGrade += subject.grades.final;
      count++;
    }
  });
  
  return count > 0 ? (totalGrade / count).toFixed(2) : 0;
};

// Método para calcular a frequência geral
academicRecordSchema.methods.calculateOverallAttendance = function() {
  if (!this.subjects || this.subjects.length === 0) {
    return 0;
  }
  
  let totalClasses = 0;
  let totalAttended = 0;
  
  this.subjects.forEach(subject => {
    if (subject.attendance.totalClasses) {
      totalClasses += subject.attendance.totalClasses;
      totalAttended += subject.attendance.attendedClasses || 0;
    }
  });
  
  return totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(2) : 0;
};

const AcademicRecord = mongoose.model("AcademicRecord", academicRecordSchema);

module.exports = AcademicRecord;