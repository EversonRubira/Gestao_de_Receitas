// Importar a conexão à base de dados e bcrypt para passwords
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// ========== FUNÇÕES PARA GERIR UTILIZADORES ==========

// Função para buscar um utilizador pelo email
function buscarUtilizadorPorEmail(email, callback) {
    const sql = 'SELECT * FROM utilizadores WHERE email = ?';

    db.query(sql, [email], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados[0]);
    });
}

// Função para buscar um utilizador pelo ID
function buscarUtilizadorPorId(id, callback) {
    const sql = 'SELECT id, nome, email, tipo, data_criacao FROM utilizadores WHERE id = ?';

    db.query(sql, [id], function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados[0]);
    });
}

// Função para criar um novo utilizador
function criarUtilizador(dados, callback) {
    // Primeiro, encriptar a password
    bcrypt.hash(dados.password, 10, function(erro, passwordHash) {
        if (erro) {
            return callback(erro, null);
        }

        // Depois de encriptar, inserir na base de dados
        const sql = 'INSERT INTO utilizadores (nome, email, password_hash, tipo) VALUES (?, ?, ?, ?)';
        const tipo = dados.tipo || 'user'; // Se não especificado, tipo 'user'

        db.query(sql, [dados.nome, dados.email, passwordHash, tipo], function(erro, resultado) {
            if (erro) {
                return callback(erro, null);
            }
            callback(null, resultado.insertId);
        });
    });
}

// Função para verificar se a password está correta
function verificarPassword(password, passwordHash, callback) {
    bcrypt.compare(password, passwordHash, function(erro, estaCorreta) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, estaCorreta);
    });
}

// Função para listar todos os utilizadores
function listarTodosUtilizadores(callback) {
    const sql = 'SELECT id, nome, email, tipo, data_criacao FROM utilizadores ORDER BY data_criacao DESC';

    db.query(sql, function(erro, resultados) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultados);
    });
}

// Função para atualizar um utilizador
function atualizarUtilizador(id, dados, callback) {
    // Se foi fornecida uma nova password, precisa ser encriptada
    if (dados.password) {
        bcrypt.hash(dados.password, 10, function(erro, passwordHash) {
            if (erro) {
                return callback(erro, null);
            }

            const sql = 'UPDATE utilizadores SET nome = ?, email = ?, tipo = ?, password_hash = ? WHERE id = ?';
            db.query(sql, [dados.nome, dados.email, dados.tipo, passwordHash, id], function(erro, resultado) {
                if (erro) {
                    return callback(erro, null);
                }
                callback(null, resultado.affectedRows > 0);
            });
        });
    } else {
        // Se não há password nova, atualizar só os outros campos
        const sql = 'UPDATE utilizadores SET nome = ?, email = ?, tipo = ? WHERE id = ?';
        db.query(sql, [dados.nome, dados.email, dados.tipo, id], function(erro, resultado) {
            if (erro) {
                return callback(erro, null);
            }
            callback(null, resultado.affectedRows > 0);
        });
    }
}

// Função para eliminar um utilizador
function eliminarUtilizador(id, callback) {
    const sql = 'DELETE FROM utilizadores WHERE id = ?';

    db.query(sql, [id], function(erro, resultado) {
        if (erro) {
            return callback(erro, null);
        }
        callback(null, resultado.affectedRows > 0);
    });
}

// Exportar as funções para serem usadas noutros ficheiros
module.exports = {
    buscarUtilizadorPorEmail: buscarUtilizadorPorEmail,
    buscarUtilizadorPorId: buscarUtilizadorPorId,
    criarUtilizador: criarUtilizador,
    verificarPassword: verificarPassword,
    listarTodosUtilizadores: listarTodosUtilizadores,
    atualizarUtilizador: atualizarUtilizador,
    eliminarUtilizador: eliminarUtilizador
};
