const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Utilizador {
    // Buscar utilizador por email
    static async findByEmail(email) {
        const [rows] = await db.query(
            'SELECT * FROM utilizadores WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Buscar utilizador por ID
    static async findById(id) {
        const [rows] = await db.query(
            'SELECT id, nome, email, tipo, data_criacao FROM utilizadores WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Criar novo utilizador
    static async create(dados) {
        const passwordHash = await bcrypt.hash(dados.password, 10);

        const [result] = await db.query(`
            INSERT INTO utilizadores (nome, email, password_hash, tipo)
            VALUES (?, ?, ?, ?)
        `, [
            dados.nome,
            dados.email,
            passwordHash,
            dados.tipo || 'user'
        ]);

        return result.insertId;
    }

    // Verificar password
    static async verificarPassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    // Listar todos os utilizadores
    static async findAll() {
        const [rows] = await db.query(
            'SELECT id, nome, email, tipo, data_criacao FROM utilizadores ORDER BY data_criacao DESC'
        );
        return rows;
    }

    // Atualizar utilizador
    static async update(id, dados) {
        let query = 'UPDATE utilizadores SET nome = ?, email = ?, tipo = ?';
        const params = [dados.nome, dados.email, dados.tipo];

        if (dados.password) {
            const passwordHash = await bcrypt.hash(dados.password, 10);
            query += ', password_hash = ?';
            params.push(passwordHash);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await db.query(query, params);
        return result.affectedRows > 0;
    }

    // Eliminar utilizador
    static async delete(id) {
        const [result] = await db.query('DELETE FROM utilizadores WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Utilizador;
