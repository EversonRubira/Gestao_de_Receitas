// ========== JAVASCRIPT PRINCIPAL DO SISTEMA DE GESTÃO DE RECEITAS ==========

// Esperar que a página carregue completamente antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gestão de Receitas - Sistema carregado com sucesso!');

    // ========== GESTÃO DE MENUS DROPDOWN ==========
    // Encontrar todos os elementos dropdown na página
    const dropdowns = document.querySelectorAll('.dropdown');

    // Para cada dropdown, adicionar evento de clique
    for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].addEventListener('click', function(evento) {
            evento.stopPropagation(); // Impedir que o clique "suba" para elementos pais

            // Alternar classe 'active' (abrir/fechar o dropdown)
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                this.classList.add('active');
            }
        });
    }

    // Fechar todos os dropdowns quando clicar fora deles
    document.addEventListener('click', function() {
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('active');
        }
    });

    // ========== CONFIRMAÇÃO DE ELIMINAÇÃO ==========
    // Encontrar todos os botões que precisam de confirmação
    const botoesEliminar = document.querySelectorAll('[data-confirm]');

    // Para cada botão, adicionar confirmação antes de eliminar
    for (let i = 0; i < botoesEliminar.length; i++) {
        botoesEliminar[i].addEventListener('click', function(evento) {
            // Obter mensagem de confirmação do atributo data-confirm
            const mensagem = this.getAttribute('data-confirm');

            // Mostrar caixa de confirmação
            const confirmou = confirm(mensagem);

            // Se não confirmou, cancelar a ação
            if (!confirmou) {
                evento.preventDefault();
            }
        });
    }
});

// ========== FUNÇÕES PARA CHAMAR A API ==========

// Função para fazer pedido GET à API
// Exemplo: fazerPedidoGET('/receitas', function(dados) { console.log(dados); })
function fazerPedidoGET(endpoint, callback) {
    // Criar novo pedido HTTP
    const xhr = new XMLHttpRequest();

    // Configurar o pedido: método GET, URL completa
    xhr.open('GET', '/api' + endpoint, true);

    // Definir o que fazer quando receber resposta
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Sucesso! Converter resposta JSON em objeto JavaScript
            try {
                const dados = JSON.parse(xhr.responseText);
                callback(null, dados);
            } catch (erro) {
                console.error('Erro ao processar resposta:', erro);
                callback(erro, null);
            }
        } else {
            // Erro no pedido
            console.error('Erro na requisição GET:', xhr.status);
            callback(new Error('Erro HTTP ' + xhr.status), null);
        }
    };

    // Definir o que fazer se houver erro de rede
    xhr.onerror = function() {
        console.error('Erro de rede ao fazer pedido GET');
        callback(new Error('Erro de rede'), null);
    };

    // Enviar o pedido
    xhr.send();
}

// Função para fazer pedido POST à API
// Exemplo: fazerPedidoPOST('/receitas', {nome: 'Bolo'}, function(dados) { ... })
function fazerPedidoPOST(endpoint, dados, callback) {
    // Criar novo pedido HTTP
    const xhr = new XMLHttpRequest();

    // Configurar o pedido: método POST, URL completa
    xhr.open('POST', '/api' + endpoint, true);

    // Definir que vamos enviar JSON
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Definir o que fazer quando receber resposta
    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 201) {
            // Sucesso! Converter resposta JSON em objeto JavaScript
            try {
                const resposta = JSON.parse(xhr.responseText);
                callback(null, resposta);
            } catch (erro) {
                console.error('Erro ao processar resposta:', erro);
                callback(erro, null);
            }
        } else {
            // Erro no pedido
            console.error('Erro na requisição POST:', xhr.status);
            callback(new Error('Erro HTTP ' + xhr.status), null);
        }
    };

    // Definir o que fazer se houver erro de rede
    xhr.onerror = function() {
        console.error('Erro de rede ao fazer pedido POST');
        callback(new Error('Erro de rede'), null);
    };

    // Converter dados para JSON e enviar
    xhr.send(JSON.stringify(dados));
}

// Função para fazer pedido PUT à API (atualizar)
// Exemplo: fazerPedidoPUT('/receitas/1', {nome: 'Novo Nome'}, function(dados) { ... })
function fazerPedidoPUT(endpoint, dados, callback) {
    // Criar novo pedido HTTP
    const xhr = new XMLHttpRequest();

    // Configurar o pedido: método PUT, URL completa
    xhr.open('PUT', '/api' + endpoint, true);

    // Definir que vamos enviar JSON
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Definir o que fazer quando receber resposta
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Sucesso! Converter resposta JSON em objeto JavaScript
            try {
                const resposta = JSON.parse(xhr.responseText);
                callback(null, resposta);
            } catch (erro) {
                console.error('Erro ao processar resposta:', erro);
                callback(erro, null);
            }
        } else {
            // Erro no pedido
            console.error('Erro na requisição PUT:', xhr.status);
            callback(new Error('Erro HTTP ' + xhr.status), null);
        }
    };

    // Definir o que fazer se houver erro de rede
    xhr.onerror = function() {
        console.error('Erro de rede ao fazer pedido PUT');
        callback(new Error('Erro de rede'), null);
    };

    // Converter dados para JSON e enviar
    xhr.send(JSON.stringify(dados));
}

// Função para fazer pedido DELETE à API (eliminar)
// Exemplo: fazerPedidoDELETE('/receitas/1', function(dados) { ... })
function fazerPedidoDELETE(endpoint, callback) {
    // Criar novo pedido HTTP
    const xhr = new XMLHttpRequest();

    // Configurar o pedido: método DELETE, URL completa
    xhr.open('DELETE', '/api' + endpoint, true);

    // Definir o que fazer quando receber resposta
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Sucesso! Converter resposta JSON em objeto JavaScript
            try {
                const resposta = JSON.parse(xhr.responseText);
                callback(null, resposta);
            } catch (erro) {
                console.error('Erro ao processar resposta:', erro);
                callback(erro, null);
            }
        } else {
            // Erro no pedido
            console.error('Erro na requisição DELETE:', xhr.status);
            callback(new Error('Erro HTTP ' + xhr.status), null);
        }
    };

    // Definir o que fazer se houver erro de rede
    xhr.onerror = function() {
        console.error('Erro de rede ao fazer pedido DELETE');
        callback(new Error('Erro de rede'), null);
    };

    // Enviar o pedido
    xhr.send();
}

// ========== FUNÇÃO PARA BUSCAR RECEITA EXTERNA ALEATÓRIA ==========
// Busca uma receita aleatória da API externa TheMealDB
function buscarReceitaExternaAleatoria(callback) {
    fazerPedidoGET('/external/random', function(erro, resultado) {
        if (erro) {
            console.error('Erro ao buscar receita externa:', erro);
            callback(erro, null);
            return;
        }

        if (resultado.success) {
            console.log('Receita externa obtida:', resultado.data);
            callback(null, resultado.data);
        } else {
            callback(new Error('Falha ao obter receita'), null);
        }
    });
}

// ========== DISPONIBILIZAR FUNÇÕES GLOBALMENTE ==========
// Tornar as funções acessíveis em toda a aplicação
window.fazerPedidoGET = fazerPedidoGET;
window.fazerPedidoPOST = fazerPedidoPOST;
window.fazerPedidoPUT = fazerPedidoPUT;
window.fazerPedidoDELETE = fazerPedidoDELETE;
window.buscarReceitaExternaAleatoria = buscarReceitaExternaAleatoria;
