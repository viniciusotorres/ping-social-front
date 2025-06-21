const express = require('express');
const path = require('path');
const app = express();

// Servir arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, 'dist/ping-social')));

// Redirecionar todas as rotas para o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ping-social/index.html'));
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
