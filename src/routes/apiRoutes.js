const express = require('express');
const router = express.Router();
const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');
const Ingrediente = require('../models/Ingrediente');
const { isAuthenticated } = require('../middleware/auth');

// ========== RECEITAS API ==========

// GET /api/receitas - Listar todas as receitas
router.get('/receitas', async (req, res) => {
    try {
        const { termo, categoria, dificuldade } = req.query;
        let receitas;

        if (termo || categoria || dificuldade) {
            receitas = await Receita.search(termo, categoria, dificuldade);
        } else {
            receitas = await Receita.findAll();
        }

        res.json({
            success: true,
            data: receitas,
            count: receitas.length
        });
    } catch (error) {
        console.error('Erro ao listar receitas:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar receitas'
        });
    }
});

// GET /api/receitas/:id - Obter receita específica
router.get('/receitas/:id', async (req, res) => {
    try {
        const receita = await Receita.findById(req.params.id);

        if (!receita) {
            return res.status(404).json({
                success: false,
                message: 'Receita não encontrada'
            });
        }

        const ingredientes = await Receita.getIngredientes(req.params.id);

        res.json({
            success: true,
            data: {
                ...receita,
                ingredientes
            }
        });
    } catch (error) {
        console.error('Erro ao obter receita:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter receita'
        });
    }
});

// POST /api/receitas - Criar nova receita
router.post('/receitas', isAuthenticated, async (req, res) => {
    try {
        const dados = {
            ...req.body,
            utilizador_id: req.session.utilizador.id
        };

        const receitaId = await Receita.create(dados);

        // Adicionar ingredientes se fornecidos
        if (req.body.ingredientes && Array.isArray(req.body.ingredientes)) {
            for (const ing of req.body.ingredientes) {
                const ingredienteId = await Ingrediente.findOrCreate(ing.nome);
                await Receita.addIngrediente(receitaId, ingredienteId, ing.quantidade);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Receita criada com sucesso',
            data: { id: receitaId }
        });
    } catch (error) {
        console.error('Erro ao criar receita:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar receita'
        });
    }
});

// PUT /api/receitas/:id - Atualizar receita
router.put('/receitas/:id', isAuthenticated, async (req, res) => {
    try {
        const atualizado = await Receita.update(req.params.id, req.body);

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
    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar receita'
        });
    }
});

// DELETE /api/receitas/:id - Eliminar receita
router.delete('/receitas/:id', isAuthenticated, async (req, res) => {
    try {
        const eliminado = await Receita.delete(req.params.id);

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
    } catch (error) {
        console.error('Erro ao eliminar receita:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao eliminar receita'
        });
    }
});

// ========== CATEGORIAS API ==========

// GET /api/categorias - Listar todas as categorias
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar categorias'
        });
    }
});

// ========== INGREDIENTES API ==========

// GET /api/ingredientes - Listar todos os ingredientes
router.get('/ingredientes', async (req, res) => {
    try {
        const ingredientes = await Ingrediente.findAll();
        res.json({
            success: true,
            data: ingredientes
        });
    } catch (error) {
        console.error('Erro ao listar ingredientes:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar ingredientes'
        });
    }
});

// ========== SERVIÇO EXTERNO - TheMealDB ==========

const axios = require('axios');

// GET /api/external/random - Obter receita aleatória do TheMealDB
router.get('/external/random', async (req, res) => {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        res.json({
            success: true,
            data: response.data.meals[0]
        });
    } catch (error) {
        console.error('Erro ao obter receita externa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao obter receita externa'
        });
    }
});

// GET /api/external/search/:term - Pesquisar receitas no TheMealDB
router.get('/external/search/:term', async (req, res) => {
    try {
        const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${req.params.term}`
        );
        res.json({
            success: true,
            data: response.data.meals || []
        });
    } catch (error) {
        console.error('Erro ao pesquisar receita externa:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao pesquisar receita externa'
        });
    }
});

module.exports = router;
