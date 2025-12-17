// Importar biblioteca do MySQL
const mysql = require('mysql2');

// Carregar variáveis de ambiente do ficheiro .env
require('dotenv').config();

// Criar conexão simples com a base de dados
// Usamos createConnection em vez de createPool para ser mais simples
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',     // Servidor da BD
    user: process.env.DB_USER || 'root',          // Utilizador da BD
    password: process.env.DB_PASSWORD || '',      // Password da BD
    database: process.env.DB_NAME || 'gestao_receitas', // Nome da BD
    port: process.env.DB_PORT || 3306             // Porta da BD (padrão MySQL é 3306)
});

// Testar se a conexão funciona
connection.connect(function(erro) {
    if (erro) {
        console.error('Erro ao conectar à base de dados:', erro.message);
        return;
    }
    console.log('Conexão à base de dados MySQL estabelecida com sucesso!');
});

// Exportar a conexão para ser usada noutros ficheiros
module.exports = connection;
