// Pesquisa de receitas com Fetch API
// Intercepta o formulário de pesquisa e usa AJAX em vez de recarregar a página

document.addEventListener('DOMContentLoaded', function() {
    // Obter elementos do DOM
    const formulario = document.querySelector('.search-form');
    const receitasGrid = document.querySelector('.receitas-grid');
    const tituloSecao = document.querySelector('.receitas-recentes h2');

    // Verificar se elementos existem
    if (!formulario || !receitasGrid) {
        return;
    }

    // Interceptar envio do formulário
    formulario.addEventListener('submit', function(evento) {
        // Prevenir comportamento padrão (recarregar página)
        evento.preventDefault();

        // Obter valores do formulário
        const termo = formulario.querySelector('input[name="termo"]').value;
        const categoria = formulario.querySelector('select[name="categoria"]').value;

        // Atualizar título da seção
        if (termo || categoria) {
            let tituloTexto = 'Resultados da Pesquisa';
            if (termo) {
                tituloTexto += ` para "${termo}"`;
            }
            tituloSecao.textContent = tituloTexto;
        } else {
            tituloSecao.textContent = 'Receitas Recentes';
        }

        // Mostrar indicador de carregamento
        receitasGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">A pesquisar receitas...</p>';

        // Construir URL da API com parâmetros
        let url = '/api/receitas?';
        const params = [];

        if (termo) {
            params.push('termo=' + encodeURIComponent(termo));
        }
        if (categoria) {
            params.push('categoria=' + encodeURIComponent(categoria));
        }

        url += params.join('&');

        // Fazer pedido à API usando Fetch
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao pesquisar receitas');
                }
                return response.json();
            })
            .then(data => {
                // Verificar se a resposta tem receitas
                if (data.success && data.data && data.data.length > 0) {
                    renderizarReceitas(data.data);
                } else {
                    receitasGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhuma receita encontrada. Tenta outros termos de pesquisa.</p>';
                }
            })
            .catch(erro => {
                console.error('Erro ao pesquisar receitas:', erro);
                receitasGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Erro ao pesquisar. Tenta novamente.</p>';
            });
    });

    // Função para renderizar as receitas no DOM
    function renderizarReceitas(receitas) {
        // Limpar grid
        receitasGrid.innerHTML = '';

        // Criar HTML para cada receita
        receitas.forEach(receita => {
            const receitaCard = criarCardReceita(receita);
            receitasGrid.innerHTML += receitaCard;
        });

        // Scroll suave até os resultados
        document.querySelector('.receitas-recentes').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Função para criar o HTML de um card de receita
    function criarCardReceita(receita) {
        // Criar imagem ou placeholder
        let imagemHTML;
        if (receita.imagem) {
            imagemHTML = `<img src="${receita.imagem}" alt="${receita.nome}">`;
        } else {
            imagemHTML = `
                <div class="receita-placeholder">
                    <span>Sem imagem</span>
                </div>
            `;
        }

        // Normalizar dificuldade para classe CSS (remover acentos)
        const dificuldadeClass = receita.dificuldade_nivel
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        // Criar HTML de avaliações (se existir)
        let avaliacoesHTML = '';
        if (receita.media_avaliacoes) {
            avaliacoesHTML = `
                <div class="receita-rating">
                    ⭐ ${parseFloat(receita.media_avaliacoes).toFixed(1)}
                    (${receita.num_avaliacoes})
                </div>
            `;
        }

        // Retornar HTML completo do card
        return `
            <div class="receita-card">
                ${imagemHTML}
                <div class="receita-info">
                    <h3>${receita.nome}</h3>
                    <p class="receita-autor">Por ${receita.autor}</p>
                    <div class="receita-meta">
                        <span class="badge badge-${dificuldadeClass}">
                            ${receita.dificuldade_nivel}
                        </span>
                        <span class="receita-tempo">
                            <svg width="16" height="16" fill="currentColor">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" fill="none"/>
                                <path d="M8 4v4l3 3"/>
                            </svg>
                            ${receita.tempo_preparacao} min
                        </span>
                        <span class="receita-custo">€${parseFloat(receita.custo).toFixed(2)}</span>
                    </div>
                    ${avaliacoesHTML}
                    <a href="/receita/${receita.id}" class="btn btn-secondary btn-small">Ver Receita</a>
                </div>
            </div>
        `;
    }
});
