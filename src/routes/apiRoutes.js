// Importar módulos necessários
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Importar funções dos models
const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');
const Ingrediente = require('../models/Ingrediente');
const Utilizador = require('../models/Utilizador');

// Importar middlewares
const { isAuthenticated } = require('../middleware/auth');
const { gerarToken, protegerRotaAPI, verificarAdmin } = require('../middleware/jwtAuth');

// ========== AUTENTICAÇÃO DA API (JWT) ==========

// POST /api/auth/login - Login para obter token JWT
// Usa-se assim:
// POST http://localhost:3000/api/auth/login
// Body: { "email": "admin@receitas.pt", "password": "admin123" }
// Resposta: { "success": true, "token": "eyJhbGc..." }
router.post('/auth/login', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // Verificar se os campos foram enviados
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email e password são obrigatórios'
        });
    }

    // Procurar utilizador por email
    Utilizador.buscarUtilizadorPorEmail(email, function(erro, utilizador) {
        if (erro) {
            console.error('Erro ao buscar utilizador:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro no servidor'
            });
        }

        // Se não encontrou utilizador
        if (!utilizador) {
            return res.status(401).json({
                success: false,
                message: 'Email ou password incorretos'
            });
        }

        // Verificar se a password está correta
        Utilizador.verificarPassword(password, utilizador.password, function(erro, passwordCorreta) {
            if (erro) {
                console.error('Erro ao verificar password:', erro);
                return res.status(500).json({
                    success: false,
                    message: 'Erro no servidor'
                });
            }

            // Se a password está errada
            if (!passwordCorreta) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou password incorretos'
                });
            }

            // Password correta! Gerar token JWT
            const token = gerarToken({
                id: utilizador.id,
                email: utilizador.email,
                tipo: utilizador.tipo
            });

            // Devolver o token
            res.json({
                success: true,
                message: 'Login efetuado com sucesso',
                token: token,
                utilizador: {
                    id: utilizador.id,
                    nome: utilizador.nome,
                    email: utilizador.email,
                    tipo: utilizador.tipo
                }
            });
        });
    });
});

// ========== API DE RECEITAS ==========

// GET /api/receitas - Listar ou pesquisar receitas
router.get('/receitas', function(req, res) {
    const termo = req.query.termo || null;
    const categoriaId = req.query.categoria || null;
    const dificuldadeId = req.query.dificuldade || null;

    // Se há filtros, pesquisar; senão listar todas
    if (termo || categoriaId || dificuldadeId) {
        Receita.pesquisarReceitas(termo, categoriaId, dificuldadeId, function(erro, receitas) {
            if (erro) {
                console.error('Erro ao pesquisar receitas:', erro);
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao pesquisar receitas'
                });
            }

            res.json({
                success: true,
                data: receitas,
                count: receitas.length
            });
        });
    } else {
        Receita.listarTodasReceitas(function(erro, receitas) {
            if (erro) {
                console.error('Erro ao listar receitas:', erro);
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao listar receitas'
                });
            }

            res.json({
                success: true,
                data: receitas,
                count: receitas.length
            });
        });
    }
});

// GET /api/receitas/:id - Obter uma receita específica
router.get('/receitas/:id', function(req, res) {
    const receitaId = req.params.id;

    Receita.buscarReceitaPorId(receitaId, function(erro, receita) {
        if (erro) {
            console.error('Erro ao obter receita:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro ao obter receita'
            });
        }

        if (!receita) {
            return res.status(404).json({
                success: false,
                message: 'Receita não encontrada'
            });
        }

        // Buscar ingredientes da receita
        Receita.buscarIngredientesReceita(receitaId, function(erro, ingredientes) {
            if (erro) {
                console.error('Erro ao obter ingredientes:', erro);
                return res.status(500).json({
                    success: false,
                    message: 'Erro ao obter receita'
                });
            }

            receita.ingredientes = ingredientes;

            res.json({
                success: true,
                data: receita
            });
        });
    });
});

// POST /api/receitas - Criar nova receita (precisa de token JWT)
router.post('/receitas', protegerRotaAPI, function(req, res) {
    const dadosReceita = req.body;
    dadosReceita.utilizador_id = req.utilizador.id;

    Receita.criarReceita(dadosReceita, function(erro, receitaId) {
        if (erro) {
            console.error('Erro ao criar receita:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro ao criar receita'
            });
        }

        // TODO: Adicionar ingredientes se existirem em req.body.ingredientes

        res.status(201).json({
            success: true,
            message: 'Receita criada com sucesso',
            data: { id: receitaId }
        });
    });
});

// PUT /api/receitas/:id - Atualizar receita (precisa de token JWT)
router.put('/receitas/:id', protegerRotaAPI, function(req, res) {
    const receitaId = req.params.id;
    const dadosReceita = req.body;

    Receita.atualizarReceita(receitaId, dadosReceita, function(erro, atualizado) {
        if (erro) {
            console.error('Erro ao atualizar receita:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro ao atualizar receita'
            });
        }

        if (!atualizado) {
            return res.status(404).json({
                success: false,
                message: 'Receita não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Receita atualizada com sucesso'
        });
    });
});

// DELETE /api/receitas/:id - Eliminar receita (precisa de token JWT)
router.delete('/receitas/:id', protegerRotaAPI, function(req, res) {
    const receitaId = req.params.id;

    Receita.eliminarReceita(receitaId, function(erro, eliminado) {
        if (erro) {
            console.error('Erro ao eliminar receita:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro ao eliminar receita'
            });
        }

        if (!eliminado) {
            return res.status(404).json({
                success: false,
                message: 'Receita não encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Receita eliminada com sucesso'
        });
    });
});

// ========== API DE CATEGORIAS ==========

// GET /api/categorias - Listar categorias
router.get('/categorias', function(req, res) {
    Categoria.listarTodasCategorias(function(erro, categorias) {
        if (erro) {
            console.error('Erro ao listar categorias:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar categorias'
            });
        }

        res.json({
            success: true,
            data: categorias
        });
    });
});

// ========== API DE INGREDIENTES ==========

// GET /api/ingredientes - Listar ingredientes
router.get('/ingredientes', function(req, res) {
    Ingrediente.listarTodosIngredientes(function(erro, ingredientes) {
        if (erro) {
            console.error('Erro ao listar ingredientes:', erro);
            return res.status(500).json({
                success: false,
                message: 'Erro ao listar ingredientes'
            });
        }

        res.json({
            success: true,
            data: ingredientes
        });
    });
});

// ========== API EXTERNA - TheMealDB ==========

// GET /api/external/random - Obter receita aleatória da API externa
router.get('/external/random', function(req, res) {
    axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(function(response) {
            res.json({
                success: true,
                data: response.data.meals[0]
            });
        })
        .catch(function(erro) {
            console.error('Erro ao obter receita externa:', erro);
            res.status(500).json({
                success: false,
                message: 'Erro ao obter receita externa'
            });
        });
});

// GET /api/external/search/:term - Pesquisar receitas na API externa
router.get('/external/search/:term', function(req, res) {
    const termo = req.params.term;
    const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + termo;

    axios.get(url)
        .then(function(response) {
            res.json({
                success: true,
                data: response.data.meals || []
            });
        })
        .catch(function(erro) {
            console.error('Erro ao pesquisar receita externa:', erro);
            res.status(500).json({
                success: false,
                message: 'Erro ao pesquisar receita externa'
            });
        });
});

// Exportar as rotas para serem usadas no servidor principal
module.exports = router;
