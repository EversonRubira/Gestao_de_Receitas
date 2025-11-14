const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');
const Ingrediente = require('../models/Ingrediente');
const db = require('../config/database');

// Todas as rotas do backoffice requerem autenticação de admin
router.use(isAuthenticated);
router.use(isAdmin);

// Dashboard do backoffice
router.get('/', async (req, res) => {
    try {
        const [[stats]] = await db.query(`
            SELECT
                (SELECT COUNT(*) FROM receitas) as total_receitas,
                (SELECT COUNT(*) FROM utilizadores) as total_utilizadores,
                (SELECT COUNT(*) FROM categorias) as total_categorias,
                (SELECT COUNT(*) FROM ingredientes) as total_ingredientes
        `);

        res.render('backoffice/dashboard', {
            title: 'Backoffice - Dashboard',
            stats
        });
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        res.status(500).send('Erro ao carregar dashboard');
    }
});

// ========== GESTÃO DE RECEITAS ==========

// Listar receitas
router.get('/receitas', async (req, res) => {
    try {
        const receitas = await Receita.findAll();
        res.render('backoffice/receitas/lista', {
            title: 'Gestão de Receitas',
            receitas
        });
    } catch (error) {
        console.error('Erro ao listar receitas:', error);
        res.status(500).send('Erro ao listar receitas');
    }
});

// Formulário de nova receita
router.get('/receitas/nova', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        const [dificuldades] = await db.query('SELECT * FROM dificuldades ORDER BY ordem');
        const ingredientes = await Ingrediente.findAll();

        res.render('backoffice/receitas/form', {
            title: 'Nova Receita',
            receita: null,
            categorias,
            dificuldades,
            ingredientes,
            error: null
        });
    } catch (error) {
        console.error('Erro ao carregar formulário:', error);
        res.status(500).send('Erro ao carregar formulário');
    }
});

// Criar receita
router.post('/receitas/nova', async (req, res) => {
    try {
        const receitaId = await Receita.create({
            ...req.body,
            utilizador_id: req.session.utilizador.id
        });

        // Processar ingredientes
        if (req.body.ingredientes) {
            const ingredientes = JSON.parse(req.body.ingredientes);
            for (const ing of ingredientes) {
                await Receita.addIngrediente(receitaId, ing.id, ing.quantidade);
            }
        }

        res.redirect('/backoffice/receitas');
    } catch (error) {
        console.error('Erro ao criar receita:', error);
        res.status(500).send('Erro ao criar receita');
    }
});

// Formulário de edição de receita
router.get('/receitas/editar/:id', async (req, res) => {
    try {
        const receita = await Receita.findById(req.params.id);
        const ingredientesReceita = await Receita.getIngredientes(req.params.id);
        const categorias = await Categoria.findAll();
        const [dificuldades] = await db.query('SELECT * FROM dificuldades ORDER BY ordem');
        const ingredientes = await Ingrediente.findAll();

        res.render('backoffice/receitas/form', {
            title: 'Editar Receita',
            receita: {
                ...receita,
                ingredientes: ingredientesReceita
            },
            categorias,
            dificuldades,
            ingredientes,
            error: null
        });
    } catch (error) {
        console.error('Erro ao carregar receita:', error);
        res.status(500).send('Erro ao carregar receita');
    }
});

// Atualizar receita
router.post('/receitas/editar/:id', async (req, res) => {
    try {
        await Receita.update(req.params.id, req.body);

        // Atualizar ingredientes (remover todos e adicionar novamente)
        // Aqui pode implementar lógica mais sofisticada se necessário

        res.redirect('/backoffice/receitas');
    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
        res.status(500).send('Erro ao atualizar receita');
    }
});

// Eliminar receita
router.post('/receitas/eliminar/:id', async (req, res) => {
    try {
        await Receita.delete(req.params.id);
        res.redirect('/backoffice/receitas');
    } catch (error) {
        console.error('Erro ao eliminar receita:', error);
        res.status(500).send('Erro ao eliminar receita');
    }
});

// ========== GESTÃO DE CATEGORIAS ==========

// Listar categorias
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.render('backoffice/categorias/lista', {
            title: 'Gestão de Categorias',
            categorias
        });
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        res.status(500).send('Erro ao listar categorias');
    }
});

// Criar categoria
router.post('/categorias/nova', async (req, res) => {
    try {
        await Categoria.create(req.body);
        res.redirect('/backoffice/categorias');
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        res.status(500).send('Erro ao criar categoria');
    }
});

// ========== GESTÃO DE INGREDIENTES ==========

// Listar ingredientes
router.get('/ingredientes', async (req, res) => {
    try {
        const ingredientes = await Ingrediente.findAll();
        res.render('backoffice/ingredientes/lista', {
            title: 'Gestão de Ingredientes',
            ingredientes
        });
    } catch (error) {
        console.error('Erro ao listar ingredientes:', error);
        res.status(500).send('Erro ao listar ingredientes');
    }
});

// Criar ingrediente
router.post('/ingredientes/novo', async (req, res) => {
    try {
        await Ingrediente.create(req.body.nome);
        res.redirect('/backoffice/ingredientes');
    } catch (error) {
        console.error('Erro ao criar ingrediente:', error);
        res.status(500).send('Erro ao criar ingrediente');
    }
});

module.exports = router;
