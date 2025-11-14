const bcrypt = require('bcryptjs');

async function testPassword() {
    const password = 'admin123';
    const hash = '$2a$10$efasFEgmGxsmcQzRCndw5eTitAdqxIPzZVVzQUePJh4vqGertck5q';
    
    const valid = await bcrypt.compare(password, hash);
    console.log('Password "admin123" válido?', valid ? 'SIM ✅' : 'NÃO ❌');
}

testPassword();
