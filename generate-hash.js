const bcrypt = require('bcryptjs');

async function generateHashes() {
    const password = 'admin123';
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);

    console.log('Hash para admin:', hash1);
    console.log('Hash para user:', hash2);
}

generateHashes();
