const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    console.log('Gerando novo hash para password: admin123');
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Hash gerado:', hash);

    console.log('\nAtualizando utilizador admin...');
    await connection.query(
        'UPDATE utilizadores SET password_hash = ? WHERE email = ?',
        [hash, 'admin@receitas.pt']
    );

    console.log('Password do admin atualizado!');

    // Testar
    const [users] = await connection.query(
        'SELECT * FROM utilizadores WHERE email = ?',
        ['admin@receitas.pt']
    );

    if (users.length > 0) {
        const user = users[0];
        const valid = await bcrypt.compare('admin123', user.password_hash);
        console.log('\nTeste de validacao:', valid ? 'SUCESSO!' : 'FALHOU!');
        console.log('Email:', user.email);
        console.log('Tipo:', user.tipo);
    }

    await connection.end();
}

resetAdmin().catch(console.error);
