// Importar módulos necessários
const path = require('path');  // Para trabalhar com caminhos de ficheiros
const fs = require('fs');      // Para trabalhar com sistema de ficheiros

// Pasta onde vamos guardar as imagens
const PASTA_UPLOADS = 'public/uploads/receitas';

// Verificar se a pasta existe, se não existir, criar
if (!fs.existsSync(PASTA_UPLOADS)) {
    fs.mkdirSync(PASTA_UPLOADS, { recursive: true });
}

// Função para fazer upload de uma imagem
function uploadImagem(ficheiro) {
    // Verificar se o ficheiro é uma imagem (JPG, PNG, etc)
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!tiposPermitidos.includes(ficheiro.mimetype)) {
        throw new Error('Tipo de ficheiro não permitido. Use JPG, PNG ou GIF');
    }

    // Verificar se o ficheiro não é muito grande (máximo 5MB)
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB em bytes
    if (ficheiro.size > tamanhoMaximo) {
        throw new Error('Ficheiro muito grande. Máximo: 5MB');
    }

    // Criar nome único para o ficheiro (para não haver conflitos)
    // Usamos a data atual + número aleatório
    const timestamp = Date.now();
    const numeroAleatorio = Math.round(Math.random() * 1000000000);
    const extensao = path.extname(ficheiro.name);
    const nomeNovo = timestamp + '-' + numeroAleatorio + extensao;

    // Caminho completo onde vamos guardar o ficheiro
    const caminhoCompleto = path.join(PASTA_UPLOADS, nomeNovo);

    // Mover o ficheiro para a pasta de uploads
    ficheiro.mv(caminhoCompleto);

    // Retornar o caminho que vamos guardar na base de dados
    return '/uploads/receitas/' + nomeNovo;
}

// Exportar a função para ser usada noutros ficheiros
module.exports = {
    uploadImagem: uploadImagem
};
