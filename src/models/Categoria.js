// Importar a conexão à base de dados
const db = require('../config/database');

// ========== FUNÇÕES PARA GERIR CATEGORIAS ==========

// Função para listar todas as categorias
function listarTodasCategorias(callback) {
    const sql = `
        SELECT c.*, COUNT(r.id) as total_receitas
        FROM categorias c
        LEFT JOIN receitas r ON c.id = r.categoria_id
        GROUP BY c.id
        ORDER BY c.nome
    `;

    db.query(sql, function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados);
    });
}

// Função para buscar uma categoria pelo ID
function buscarCategoriaPorId(id, callback) {
    const sql = 'SELECT * FROM categorias WHERE id = ?';

    db.query(sql, [id], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados[0]);
    });
}

// Função para criar uma nova categoria
function criarCategoria(dados, callback) {
    const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)';

    db.query(sql, [dados.nome, dados.descricao], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.insertId);
    });
}

// Função para atualizar uma categoria
function atualizarCategoria(id, dados, callback) {
    const sql = 'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?';

    db.query(sql, [dados.nome, dados.descricao, id], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.affectedRows > 0);
    });
}

// Função para eliminar uma categoria
function eliminarCategoria(id, callback) {
    const sql = 'DELETE FROM categorias WHERE id = ?';

    db.query(sql, [id], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.affectedRows > 0);
    });
}

// Exportar as funções para serem usadas noutros ficheiros
module.exports = {
    listarTodasCategorias: listarTodasCategorias,
    buscarCategoriaPorId: buscarCategoriaPorId,
    criarCategoria: criarCategoria,
    atualizarCategoria: atualizarCategoria,
    eliminarCategoria: eliminarCategoria
};
