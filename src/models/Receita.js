const db = require('../config/database');

class Receita {

    // Listar todas as receitas
    static async findAll() {
        const [rows] = await db.query(`
            SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
            FROM receitas r
            JOIN categorias c ON r.categoria_id = c.id
            JOIN dificuldades d ON r.dificuldade_id = d.id
            ORDER BY r.data_criacao DESC
        `);
        return rows;
    }

    // Buscar receita por ID
    static async findById(id) {
        const [rows] = await db.query(`
            SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel,
                   u.nome as criador_nome
            FROM receitas r
            JOIN categorias c ON r.categoria_id = c.id
            JOIN dificuldades d ON r.dificuldade_id = d.id
            JOIN utilizadores u ON r.utilizador_id = u.id
            WHERE r.id = ?
        `, [id]);
        return rows[0];
    }

    // Buscar ingredientes de uma receita
    static async getIngredientes(receitaId) {
        const [rows] = await db.query(`
            SELECT i.id, i.nome, ri.quantidade
            FROM receita_ingredientes ri
            JOIN ingredientes i ON ri.ingrediente_id = i.id
            WHERE ri.receita_id = ?
            ORDER BY i.nome
        `, [receitaId]);
        return rows;
    }

    // Criar nova receita
    static async create(dados) {
        const [result] = await db.query(`
            INSERT INTO receitas (nome, autor, descricao_preparacao, tempo_preparacao,
                                custo, porcoes, imagem, categoria_id, dificuldade_id, utilizador_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            dados.nome,
            dados.autor,
            dados.descricao_preparacao,
            dados.tempo_preparacao,
            dados.custo,
            dados.porcoes || 1,
            dados.imagem || null,
            dados.categoria_id,
            dados.dificuldade_id,
            dados.utilizador_id
        ]);
        return result.insertId;
    }

    static async update(id, dados) {
        const [result] = await db.query(`
            UPDATE receitas
            SET nome = ?, autor = ?, descricao_preparacao = ?, tempo_preparacao = ?,
                custo = ?, porcoes = ?, categoria_id = ?, dificuldade_id = ?, imagem = ?
            WHERE id = ?
        `, [
            dados.nome, dados.autor, dados.descricao_preparacao,
            dados.tempo_preparacao, dados.custo, dados.porcoes,
            dados.categoria_id, dados.dificuldade_id, dados.imagem, id
        ]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM receitas WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Adicionar ingrediente à receita
    static async addIngrediente(receitaId, ingredienteId, quantidade) {
        const [result] = await db.query(`
            INSERT INTO receita_ingredientes (receita_id, ingrediente_id, quantidade)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantidade = ?
        `, [receitaId, ingredienteId, quantidade, quantidade]);
        return result.insertId;
    }

    // Remover ingrediente da receita
    static async removeIngrediente(receitaId, ingredienteId) {
        const [result] = await db.query(`
            DELETE FROM receita_ingredientes
            WHERE receita_id = ? AND ingrediente_id = ?
        `, [receitaId, ingredienteId]);
        return result.affectedRows > 0;
    }

    // Buscar por categoria
    static async findByCategoria(categoriaId) {
        const [rows] = await db.query(`
            SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
            FROM receitas r
            JOIN categorias c ON r.categoria_id = c.id
            JOIN dificuldades d ON r.dificuldade_id = d.id
            WHERE r.categoria_id = ?
            ORDER BY r.data_criacao DESC
        `, [categoriaId]);
        return rows;
    }

    static async search(termo, categoriaId = null, dificuldadeId = null) {
        let query = `
            SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
            FROM receitas r
            JOIN categorias c ON r.categoria_id = c.id
            JOIN dificuldades d ON r.dificuldade_id = d.id
            WHERE 1=1
        `;
        const params = [];

        if (termo) {
            query += ' AND (r.nome LIKE ? OR r.autor LIKE ? OR r.descricao_preparacao LIKE ?)';
            const termoLike = `%${termo}%`;
            params.push(termoLike, termoLike, termoLike);
        }

        if (categoriaId) {
            query += ' AND r.categoria_id = ?';
            params.push(categoriaId);
        }

        if (dificuldadeId) {
            query += ' AND r.dificuldade_id = ?';
            params.push(dificuldadeId);
        }

        query += ' ORDER BY r.data_criacao DESC';

        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = Receita;
