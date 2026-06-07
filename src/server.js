const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Documentação disponível em http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar com o banco de dados:', err);
    process.exit(1);
  });
