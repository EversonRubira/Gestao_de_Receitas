const express = require('express');
const router = express.Router();
const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');

// Página inicial - Lista de receitas
router.get('/', async (req, res) => {
    try {
        const receitas = await Receita.findAll();
        const categorias = await Categoria.findAll();

        res.render('frontoffice/index', {
            title: 'Gestão de Receitas',
            receitas,
            categorias
        });
    } catch (error) {
        console.error('Erro ao carregar página inicial:', error);
        res.status(500).send('Erro ao carregar página');
    }
});

// Página de detalhes da receita
router.get('/receita/:id', async (req, res) => {
    try {
        const receita = await Receita.findById(req.params.id);

        if (!receita) {
            return res.status(404).send('Receita não encontrada');
        }

        const ingredientes = await Receita.getIngredientes(req.params.id);

        res.render('frontoffice/receita', {
            title: receita.nome,
            receita,
            ingredientes
        });
    } catch (error) {
        console.error('Erro ao carregar receita:', error);
        res.status(500).send('Erro ao carregar receita');
    }
});

// Receitas por categoria
router.get('/categoria/:id', async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        const receitas = await Receita.findByCategoria(req.params.id);
        const categorias = await Categoria.findAll();

        res.render('frontoffice/categoria', {
            title: `Receitas - ${categoria.nome}`,
            categoria,
            receitas,
            categorias
        });
    } catch (error) {
        console.error('Erro ao carregar categoria:', error);
        res.status(500).send('Erro ao carregar categoria');
    }
});

// Pesquisa de receitas
router.get('/pesquisa', async (req, res) => {
    try {
        const { termo, categoria, dificuldade } = req.query;
        const receitas = await Receita.search(termo, categoria, dificuldade);
        const categorias = await Categoria.findAll();

        res.render('frontoffice/pesquisa', {
            title: 'Pesquisa de Receitas',
            receitas,
            categorias,
            termo: termo || '',
            categoriaId: categoria || '',
            dificuldadeId: dificuldade || ''
        });
    } catch (error) {
        console.error('Erro na pesquisa:', error);
        res.status(500).send('Erro na pesquisa');
    }
});

module.exports = router;
