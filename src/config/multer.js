// ========================================
// CONFIGURAÇÃO DO MULTER - Upload de Arquivos
// ========================================
// Multer = middleware para upload de arquivos (imagens, PDFs, etc.)
const multer = require('multer');
const path = require('path');

// ========================================
// CONFIGURAR ARMAZENAMENTO
// ========================================
// Define ONDE e COMO os arquivos serão salvos
const storage = multer.diskStorage({
    // Definir a pasta de destino
    destination: function (req, file, cb) {
        // cb = callback (função que retorna o resultado)
        // null = sem erro
        // 'public/uploads/receitas' = pasta onde salvar
        cb(null, 'public/uploads/receitas');
    },

    // Definir o NOME do arquivo
    filename: function (req, file, cb) {
        // Criar nome único: timestamp + nome original
        // Exemplo: 1705234567890-bolo-chocolate.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        // path.extname = pega a extensão do arquivo (.jpg, .png)
        // file.originalname = nome original do arquivo
        const extension = path.extname(file.originalname);

        // Nome final: timestamp-numero_aleatorio + extensao
        cb(null, uniqueSuffix + extension);
    }
});

// ========================================
// FILTRO DE TIPOS DE ARQUIVO
// ========================================
// Só aceitar imagens (jpg, jpeg, png, gif, webp)
const fileFilter = function (req, file, cb) {
    // Tipos MIME permitidos
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    // Verificar se o tipo do arquivo está na lista
    if (allowedMimes.includes(file.mimetype)) {
        // Aceitar o arquivo
        cb(null, true);
    } else {
        // Rejeitar o arquivo
        cb(new Error('Tipo de arquivo não permitido. Use apenas: JPG, PNG, GIF ou WEBP'), false);
    }
};

// ========================================
// CRIAR CONFIGURAÇÃO DO MULTER
// ========================================
const upload = multer({
    storage: storage,           // Onde e como salvar
    fileFilter: fileFilter,     // Validar tipo de arquivo
    limits: {
        fileSize: 5 * 1024 * 1024  // Limite: 5MB (5 * 1024KB * 1024 bytes)
    }
});

// ========================================
// EXPORTAR CONFIGURAÇÃO
// ========================================
// Outros arquivos podem usar:
// const upload = require('./config/multer');
// router.post('/receitas', upload.single('imagem'), ...);
module.exports = upload;
