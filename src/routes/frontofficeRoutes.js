// Importar módulos necessários
const express = require('express');
const router = express.Router();

// Importar funções dos models
const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');

// ========== PÁGINA INICIAL ==========
// Mostrar lista de todas as receitas
router.get('/', function(req, res) {
    // Buscar todas as receitas
    Receita.listarTodasReceitas(function(erro, receitas) {
        if (erro) {
            console.error('Erro ao carregar receitas:', erro);
            return res.status(500).send('Erro ao carregar página');
        }

        // Buscar todas as categorias para o menu
        Categoria.listarTodasCategorias(function(erro, categorias) {
            if (erro) {
                console.error('Erro ao carregar categorias:', erro);
                return res.status(500).send('Erro ao carregar página');
            }

            // Mostrar a página inicial
            res.render('frontoffice/index', {
                title: 'Gestão de Receitas',
                receitas: receitas,
                categorias: categorias
            });
        });
    });
});

// ========== PÁGINA DE DETALHES DA RECEITA ==========
router.get('/receita/:id', function(req, res) {
    const receitaId = req.params.id;

    // Buscar a receita pelo ID
    Receita.buscarReceitaPorId(receitaId, function(erro, receita) {
        if (erro) {
            console.error('Erro ao carregar receita:', erro);
            return res.status(500).send('Erro ao carregar receita');
        }

        // Verificar se a receita existe
        if (!receita) {
            return res.status(404).send('Receita não encontrada');
        }

        // Buscar ingredientes da receita
        Receita.buscarIngredientesReceita(receitaId, function(erro, ingredientes) {
            if (erro) {
                console.error('Erro ao carregar ingredientes:', erro);
                return res.status(500).send('Erro ao carregar receita');
            }

            // Mostrar página de detalhes
            res.render('frontoffice/receita', {
                title: receita.nome,
                receita: receita,
                ingredientes: ingredientes
            });
        });
    });
});

// ========== RECEITAS POR CATEGORIA ==========
router.get('/categoria/:id', function(req, res) {
    const categoriaId = req.params.id;

    // Buscar a categoria
    Categoria.buscarCategoriaPorId(categoriaId, function(erro, categoria) {
        if (erro) {
            console.error('Erro ao carregar categoria:', erro);
            return res.status(500).send('Erro ao carregar categoria');
        }

        // Buscar receitas desta categoria
        Receita.buscarPorCategoria(categoriaId, function(erro, receitas) {
            if (erro) {
                console.error('Erro ao carregar receitas:', erro);
                return res.status(500).send('Erro ao carregar categoria');
            }

            // Buscar todas as categorias para o menu
            Categoria.listarTodasCategorias(function(erro, categorias) {
                if (erro) {
                    console.error('Erro ao carregar categorias:', erro);
                    return res.status(500).send('Erro ao carregar categoria');
                }

                // Mostrar página da categoria
                res.render('frontoffice/categoria', {
                    title: 'Receitas - ' + categoria.nome,
                    categoria: categoria,
                    receitas: receitas,
                    categorias: categorias
                });
            });
        });
    });
});

// ========== PESQUISA DE RECEITAS ==========
router.get('/pesquisa', function(req, res) {
    const termo = req.query.termo || '';
    const categoriaId = req.query.categoria || null;
    const dificuldadeId = req.query.dificuldade || null;

    // Pesquisar receitas
    Receita.pesquisarReceitas(termo, categoriaId, dificuldadeId, function(erro, receitas) {
        if (erro) {
            console.error('Erro na pesquisa:', erro);
            return res.status(500).send('Erro na pesquisa');
        }

        // Buscar categorias para o menu
        Categoria.listarTodasCategorias(function(erro, categorias) {
            if (erro) {
                console.error('Erro ao carregar categorias:', erro);
                return res.status(500).send('Erro na pesquisa');
            }

            // Mostrar página de resultados
            res.render('frontoffice/pesquisa', {
                title: 'Pesquisa de Receitas',
                receitas: receitas,
                categorias: categorias,
                termo: termo,
                categoriaId: categoriaId || '',
                dificuldadeId: dificuldadeId || ''
            });
        });
    });
});

// Exportar as rotas para serem usadas no servidor principal
module.exports = router;
