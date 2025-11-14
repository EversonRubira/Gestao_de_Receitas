const db = require('../config/database');

class Categoria {
    // Listar todas as categorias
    static async findAll() {
        const [rows] = await db.query(`
            SELECT c.*, COUNT(r.id) as total_receitas
            FROM categorias c
            LEFT JOIN receitas r ON c.id = r.categoria_id
            GROUP BY c.id
            ORDER BY c.nome
        `);
        return rows;
    }

    // Buscar categoria por ID
    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
        return rows[0];
    }

    // Criar nova categoria
    static async create(dados) {
        const [result] = await db.query(
            'INSERT INTO categorias (nome, descricao) VALUES (?, ?)',
            [dados.nome, dados.descricao]
        );
        return result.insertId;
    }

    // Atualizar categoria
    static async update(id, dados) {
        const [result] = await db.query(
            'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?',
            [dados.nome, dados.descricao, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar categoria
    static async delete(id) {
        const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = Categoria;
