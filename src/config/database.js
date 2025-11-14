// Configuração MySQL
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gestao_receitas',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    typeCast: function (field, next) {
        if (field.type === 'VAR_STRING' || field.type === 'STRING' || field.type === 'TINY_BLOB' || field.type === 'MEDIUM_BLOB' || field.type === 'LONG_BLOB' || field.type === 'BLOB') {
            return field.string();
        }
        return next();
    }
});

const promisePool = pool.promise();

// Testar conexão
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar à base de dados:', err.message);
        return;
    }

    console.log('Conexão à base de dados OK');

    connection.query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'", (error) => {
        if (error) {
            console.error('Erro ao configurar charset:', error.message);
            connection.release();
            return;
        }

        connection.query("SET CHARACTER SET utf8mb4", (error) => {
            if (error) {
                console.error('Erro ao configurar character set:', error.message);
            }
            connection.release();
        });
    });
});

module.exports = promisePool;
