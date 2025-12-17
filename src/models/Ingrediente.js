// Importar a conexão à base de dados
const db = require('../config/database');

// ========== FUNÇÕES PARA GERIR INGREDIENTES ==========

// Função para listar todos os ingredientes
function listarTodosIngredientes(callback) {
    const sql = 'SELECT * FROM ingredientes ORDER BY nome';

    db.query(sql, function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados);
    });
}

// Função para buscar um ingrediente pelo ID
function buscarIngredientePorId(id, callback) {
    const sql = 'SELECT * FROM ingredientes WHERE id = ?';

    db.query(sql, [id], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados[0]);
    });
}

// Função para buscar um ingrediente pelo nome
function buscarIngredientePorNome(nome, callback) {
    const sql = 'SELECT * FROM ingredientes WHERE nome = ?';

    db.query(sql, [nome], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados[0]);
    });
}

// Função para criar um novo ingrediente
function criarIngrediente(nome, callback) {
    const sql = 'INSERT INTO ingredientes (nome) VALUES (?)';

    db.query(sql, [nome], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.insertId);
    });
}

// Função para atualizar um ingrediente
function atualizarIngrediente(id, nome, callback) {
    const sql = 'UPDATE ingredientes SET nome = ? WHERE id = ?';

    db.query(sql, [nome, id], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.affectedRows > 0);
    });
}

// Função para eliminar um ingrediente
function eliminarIngrediente(id, callback) {
    const sql = 'DELETE FROM ingredientes WHERE id = ?';

    db.query(sql, [id], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.affectedRows > 0);
    });
}

// Exportar as funções para serem usadas noutros ficheiros
module.exports = {
    listarTodosIngredientes: listarTodosIngredientes,
    buscarIngredientePorId: buscarIngredientePorId,
    buscarIngredientePorNome: buscarIngredientePorNome,
    criarIngrediente: criarIngrediente,
    atualizarIngrediente: atualizarIngrediente,
    eliminarIngrediente: eliminarIngrediente
};
