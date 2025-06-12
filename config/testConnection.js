const db = require('./database.js');

(async () => {
    try {
        await db.authenticate();
        console.log('Conexão com o banco de dados foi bem-sucedida.');
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
    }
})();