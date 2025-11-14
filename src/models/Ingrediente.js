const db = require('../config/database');

class Ingrediente {
    // Listar todos os ingredientes
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM ingredientes ORDER BY nome');
        return rows;
    }

    // Buscar ingrediente por ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM ingredientes WHERE id = ?', [id]);
        return rows[0];
    }

    // Buscar ingrediente por nome
    static async findByNome(nome) {
        const [rows] = await db.query('SELECT * FROM ingredientes WHERE nome = ?', [nome]);
        return rows[0];
    }

    // Criar novo ingrediente
    static async create(nome) {
        const [result] = await db.query(
            'INSERT INTO ingredientes (nome) VALUES (?)',
            [nome]
        );
        return result.insertId;
    }

    // Atualizar ingrediente
    static async update(id, nome) {
        const [result] = await db.query(
            'UPDATE ingredientes SET nome = ? WHERE id = ?',
            [nome, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar ingrediente
    static async delete(id) {
        const [result] = await db.query('DELETE FROM ingredientes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Buscar ou criar ingrediente
    static async findOrCreate(nome) {
        const existe = await this.findByNome(nome);
        if (existe) {
            return existe.id;
        }
        return await this.create(nome);
    }
}

module.exports = Ingrediente;
