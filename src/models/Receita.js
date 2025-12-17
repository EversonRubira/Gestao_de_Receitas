// Importar a conexão à base de dados
const db = require('../config/database');

// ========== FUNÇÕES PARA GERIR RECEITAS ==========

// Função para listar todas as receitas
function listarTodasReceitas(callback) {
    const sql = `
        SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
        FROM receitas r
        JOIN categorias c ON r.categoria_id = c.id
        JOIN dificuldades d ON r.dificuldade_id = d.id
        ORDER BY r.data_criacao DESC
    `;

    db.query(sql, function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados);
    });
}

// Função para buscar uma receita específica pelo ID
function buscarReceitaPorId(id, callback) {
    const sql = `
        SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel,
               u.nome as criador_nome
        FROM receitas r
        JOIN categorias c ON r.categoria_id = c.id
        JOIN dificuldades d ON r.dificuldade_id = d.id
        JOIN utilizadores u ON r.utilizador_id = u.id
        WHERE r.id = ?
    `;

    db.query(sql, [id], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados[0]);
    });
}

// Função para buscar os ingredientes de uma receita
function buscarIngredientesReceita(receitaId, callback) {
    const sql = `
        SELECT i.id, i.nome, ri.quantidade
        FROM receita_ingredientes ri
        JOIN ingredientes i ON ri.ingrediente_id = i.id
        WHERE ri.receita_id = ?
        ORDER BY i.nome
    `;

    db.query(sql, [receitaId], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados);
    });
}

// Função para criar uma nova receita
function criarReceita(dados, callback) {
    const sql = `
        INSERT INTO receitas (nome, autor, descricao_preparacao, tempo_preparacao,
                            custo, porcoes, imagem, categoria_id, dificuldade_id, utilizador_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        dados.nome,
        dados.autor,
        dados.descricao_preparacao,
        dados.tempo_preparacao,
        dados.custo,
        dados.porcoes,
        dados.imagem,
        dados.categoria_id,
        dados.dificuldade_id,
        dados.utilizador_id
    ];

    db.query(sql, valores, function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        // Retornar o ID da receita criada
        callback(null, resultado.insertId);
    });
}

// Função para atualizar uma receita existente
function atualizarReceita(id, dados, callback) {
    const sql = `
        UPDATE receitas
        SET nome = ?, autor = ?, descricao_preparacao = ?, tempo_preparacao = ?,
            custo = ?, porcoes = ?, categoria_id = ?, dificuldade_id = ?, imagem = ?
        WHERE id = ?
    `;

    const valores = [
        dados.nome,
        dados.autor,
        dados.descricao_preparacao,
        dados.tempo_preparacao,
        dados.custo,
        dados.porcoes,
        dados.categoria_id,
        dados.dificuldade_id,
        dados.imagem,
        id
    ];

    db.query(sql, valores, function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.affectedRows > 0);
    });
}

// Função para eliminar uma receita
function eliminarReceita(id, callback) {
    const sql = 'DELETE FROM receitas WHERE id = ?';

    db.query(sql, [id], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.affectedRows > 0);
    });
}

// Função para adicionar um ingrediente a uma receita
function adicionarIngrediente(receitaId, ingredienteId, quantidade, callback) {
    const sql = `
        INSERT INTO receita_ingredientes (receita_id, ingrediente_id, quantidade)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [receitaId, ingredienteId, quantidade], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.insertId);
    });
}

// Função para buscar receitas por categoria
function buscarPorCategoria(categoriaId, callback) {
    const sql = `
        SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
        FROM receitas r
        JOIN categorias c ON r.categoria_id = c.id
        JOIN dificuldades d ON r.dificuldade_id = d.id
        WHERE r.categoria_id = ?
        ORDER BY r.data_criacao DESC
    `;

    db.query(sql, [categoriaId], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados);
    });
}

// Função para pesquisar receitas
function pesquisarReceitas(termo, categoriaId, dificuldadeId, callback) {
    let sql = `
        SELECT r.*, c.nome as categoria_nome, d.nivel as dificuldade_nivel
        FROM receitas r
        JOIN categorias c ON r.categoria_id = c.id
        JOIN dificuldades d ON r.dificuldade_id = d.id
        WHERE 1=1
    `;

    const parametros = [];

    // Se foi fornecido um termo de pesquisa
    if (termo) {
        sql += ' AND (r.nome LIKE ? OR r.autor LIKE ? OR r.descricao_preparacao LIKE ?)';
        const termoLike = '%' + termo + '%';
        parametros.push(termoLike, termoLike, termoLike);
    }

    // Se foi fornecida uma categoria
    if (categoriaId) {
        sql += ' AND r.categoria_id = ?';
        parametros.push(categoriaId);
    }

    // Se foi fornecida uma dificuldade
    if (dificuldadeId) {
        sql += ' AND r.dificuldade_id = ?';
        parametros.push(dificuldadeId);
    }

    sql += ' ORDER BY r.data_criacao DESC';

    db.query(sql, parametros, function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados);
    });
}

// Exportar todas as funções para serem usadas noutros ficheiros
module.exports = {
    listarTodasReceitas: listarTodasReceitas,
    buscarReceitaPorId: buscarReceitaPorId,
    buscarIngredientesReceita: buscarIngredientesReceita,
    criarReceita: criarReceita,
    atualizarReceita: atualizarReceita,
    eliminarReceita: eliminarReceita,
    adicionarIngrediente: adicionarIngrediente,
    buscarPorCategoria: buscarPorCategoria,
    pesquisarReceitas: pesquisarReceitas
};
