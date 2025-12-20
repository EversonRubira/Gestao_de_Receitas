// Importar módulos necessários
const express = require('express');
const router = express.Router();

// Importar middleware de autenticação
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Importar funções dos models
const Receita = require('../models/Receita');
const Categoria = require('../models/Categoria');
const Ingrediente = require('../models/Ingrediente');

// Importar conexão à base de dados
const db = require('../config/database');

// Importar função de upload
const upload = require('../config/upload');

// ========== PROTEÇÃO DE ROTAS ==========
// Todas as páginas do backoffice precisam de login E ser admin
router.use(isAuthenticated);
router.use(isAdmin);

// ========== PÁGINA PRINCIPAL DO BACKOFFICE (DASHBOARD) ==========
router.get('/', function(req, res) {
    // Query SQL para contar totais
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM receitas) as total_receitas,
            (SELECT COUNT(*) FROM utilizadores) as total_utilizadores,
            (SELECT COUNT(*) FROM categorias) as total_categorias,
            (SELECT COUNT(*) FROM ingredientes) as total_ingredientes
    `;

    db.query(sql, function(erro, resultados) {
        if (erro) {
            console.error('Erro ao carregar dashboard:', erro);
            return res.status(500).send('Erro ao carregar dashboard');
        }

        // Renderizar a página do dashboard
        res.render('backoffice/dashboard', {
            title: 'Backoffice - Dashboard',
            stats: resultados[0]
        });
    });
});

// ========== GESTÃO DE RECEITAS ==========

// Página que lista todas as receitas
router.get('/receitas', function(req, res) {
    // Chamar função para listar receitas
    Receita.listarTodasReceitas(function(erro, receitas) {
        if (erro) {
            console.error('Erro ao listar receitas:', erro);
            return res.status(500).send('Erro ao listar receitas');
        }

        // Mostrar a página com a lista de receitas
        res.render('backoffice/receitas/lista', {
            title: 'Gestão de Receitas',
            receitas: receitas
        });
    });
});

// Página do formulário para criar uma nova receita
router.get('/receitas/nova', function(req, res) {
    // Precisamos buscar categorias, dificuldades e ingredientes para mostrar no formulário
    // Vamos fazer 3 queries diferentes

    Categoria.listarTodasCategorias(function(erro, categorias) {
        if (erro) {
            console.error('Erro ao carregar categorias:', erro);
            return res.status(500).send('Erro ao carregar formulário');
        }

        // Buscar dificuldades
        db.query('SELECT * FROM dificuldades ORDER BY ordem', function(erro, dificuldades) {
            if (erro) {
                console.error('Erro ao carregar dificuldades:', erro);
                return res.status(500).send('Erro ao carregar formulário');
            }

            // Buscar ingredientes
            Ingrediente.listarTodosIngredientes(function(erro, ingredientes) {
                if (erro) {
                    console.error('Erro ao carregar ingredientes:', erro);
                    return res.status(500).send('Erro ao carregar formulário');
                }

                // Mostrar o formulário
                res.render('backoffice/receitas/form', {
                    title: 'Nova Receita',
                    receita: null,
                    categorias: categorias,
                    dificuldades: dificuldades,
                    ingredientes: ingredientes,
                    error: null
                });
            });
        });
    });
});

// Processar formulário de criação de receita
router.post('/receitas/nova', function(req, res) {
    // Preparar dados da receita
    const receitaData = {
        nome: req.body.nome,
        autor: req.body.autor,
        descricao_preparacao: req.body.descricao_preparacao,
        tempo_preparacao: req.body.tempo_preparacao,
        custo: req.body.custo,
        porcoes: req.body.porcoes,
        categoria_id: req.body.categoria_id,
        dificuldade_id: req.body.dificuldade_id,
        utilizador_id: req.utilizador.id,  // Agora vem do token JWT
        imagem: null
    };

    // Upload de imagem se enviada
    if (req.files && req.files.imagem) {
        try {
            receitaData.imagem = upload.uploadImagem(req.files.imagem);
        } catch (erro) {
            console.error('Erro ao fazer upload da imagem:', erro);
            return res.status(500).send('Erro ao fazer upload da imagem: ' + erro.message);
        }
    }

    // Criar a receita
    Receita.criarReceita(receitaData, function(erro, receitaId) {
        if (erro) {
            console.error('Erro ao criar receita:', erro);
            return res.status(500).send('Erro ao criar receita: ' + erro.message);
        }

        // Processar ingredientes se foram enviados
        if (req.body.ingredientes) {
            const ingredientes = JSON.parse(req.body.ingredientes);

            // Função para adicionar ingredientes um por um
            let index = 0;
            function adicionarProximoIngrediente() {
                if (index >= ingredientes.length) {
                    // Todos ingredientes adicionados, redirecionar
                    return res.redirect('/backoffice/receitas');
                }

                const ing = ingredientes[index];
                Receita.adicionarIngrediente(receitaId, ing.id, ing.quantidade, function(erro) {
                    if (erro) {
                        console.error('Erro ao adicionar ingrediente:', erro);
                    }
                    index++;
                    adicionarProximoIngrediente();
                });
            }

            adicionarProximoIngrediente();
        } else {
            res.redirect('/backoffice/receitas');
        }
    });
});

// Página do formulário para editar uma receita
router.get('/receitas/editar/:id', function(req, res) {
    const receitaId = req.params.id;

    // Buscar a receita
    Receita.buscarReceitaPorId(receitaId, function(erro, receita) {
        if (erro) {
            console.error('Erro ao carregar receita:', erro);
            return res.status(500).send('Erro ao carregar receita');
        }

        // Buscar ingredientes da receita
        Receita.buscarIngredientesReceita(receitaId, function(erro, ingredientesReceita) {
            if (erro) {
                console.error('Erro ao carregar ingredientes:', erro);
                return res.status(500).send('Erro ao carregar receita');
            }

            // Buscar categorias
            Categoria.listarTodasCategorias(function(erro, categorias) {
                if (erro) {
                    console.error('Erro ao carregar categorias:', erro);
                    return res.status(500).send('Erro ao carregar formulário');
                }

                // Buscar dificuldades
                db.query('SELECT * FROM dificuldades ORDER BY ordem', function(erro, dificuldades) {
                    if (erro) {
                        console.error('Erro ao carregar dificuldades:', erro);
                        return res.status(500).send('Erro ao carregar formulário');
                    }

                    // Buscar todos os ingredientes
                    Ingrediente.listarTodosIngredientes(function(erro, ingredientes) {
                        if (erro) {
                            console.error('Erro ao carregar ingredientes:', erro);
                            return res.status(500).send('Erro ao carregar formulário');
                        }

                        // Adicionar ingredientes à receita
                        receita.ingredientes = ingredientesReceita;

                        // Mostrar o formulário
                        res.render('backoffice/receitas/form', {
                            title: 'Editar Receita',
                            receita: receita,
                            categorias: categorias,
                            dificuldades: dificuldades,
                            ingredientes: ingredientes,
                            error: null
                        });
                    });
                });
            });
        });
    });
});

// Processar formulário de edição de receita
router.post('/receitas/editar/:id', function(req, res) {
    const receitaId = req.params.id;

    // Preparar dados da receita
    const receitaData = {
        nome: req.body.nome,
        autor: req.body.autor,
        descricao_preparacao: req.body.descricao_preparacao,
        tempo_preparacao: req.body.tempo_preparacao,
        custo: req.body.custo,
        porcoes: req.body.porcoes,
        categoria_id: req.body.categoria_id,
        dificuldade_id: req.body.dificuldade_id,
        imagem: req.body.imagem_atual || null
    };

    // Upload de nova imagem se enviada
    if (req.files && req.files.imagem) {
        try {
            receitaData.imagem = upload.uploadImagem(req.files.imagem);
        } catch (erro) {
            console.error('Erro ao fazer upload da imagem:', erro);
            return res.status(500).send('Erro ao fazer upload da imagem: ' + erro.message);
        }
    }

    // Atualizar a receita
    Receita.atualizarReceita(receitaId, receitaData, function(erro) {
        if (erro) {
            console.error('Erro ao atualizar receita:', erro);
            return res.status(500).send('Erro ao atualizar receita: ' + erro.message);
        }

        res.redirect('/backoffice/receitas');
    });
});

// Eliminar receita
router.post('/receitas/eliminar/:id', function(req, res) {
    const receitaId = req.params.id;

    Receita.eliminarReceita(receitaId, function(erro) {
        if (erro) {
            console.error('Erro ao eliminar receita:', erro);
            return res.status(500).send('Erro ao eliminar receita');
        }

        res.redirect('/backoffice/receitas');
    });
});

// ========== GESTÃO DE CATEGORIAS ==========

// Página que lista todas as categorias
router.get('/categorias', function(req, res) {
    Categoria.listarTodasCategorias(function(erro, categorias) {
        if (erro) {
            console.error('Erro ao listar categorias:', erro);
            return res.status(500).send('Erro ao listar categorias');
        }

        res.render('backoffice/categorias/lista', {
            title: 'Gestão de Categorias',
            categorias: categorias
        });
    });
});

// Criar nova categoria
router.post('/categorias/nova', function(req, res) {
    Categoria.criarCategoria(req.body, function(erro) {
        if (erro) {
            console.error('Erro ao criar categoria:', erro);
            return res.status(500).send('Erro ao criar categoria');
        }

        res.redirect('/backoffice/categorias');
    });
});

// ========== GESTÃO DE INGREDIENTES ==========

// Página que lista todos os ingredientes
router.get('/ingredientes', function(req, res) {
    Ingrediente.listarTodosIngredientes(function(erro, ingredientes) {
        if (erro) {
            console.error('Erro ao listar ingredientes:', erro);
            return res.status(500).send('Erro ao listar ingredientes');
        }

        res.render('backoffice/ingredientes/lista', {
            title: 'Gestão de Ingredientes',
            ingredientes: ingredientes
        });
    });
});

// Criar novo ingrediente
router.post('/ingredientes/novo', function(req, res) {
    Ingrediente.criarIngrediente(req.body.nome, function(erro) {
        if (erro) {
            console.error('Erro ao criar ingrediente:', erro);
            return res.status(500).send('Erro ao criar ingrediente');
        }

        res.redirect('/backoffice/ingredientes');
    });
});

// Exportar as rotas para serem usadas no servidor principal
module.exports = router;
