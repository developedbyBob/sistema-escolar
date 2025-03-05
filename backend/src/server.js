const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado ao MongoDB Atlas'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend do Sistema Escolar está rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});