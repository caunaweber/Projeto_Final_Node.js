const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API da Plataforma de Feedback',
            version: '1.0.0',
            description: 'Documentação da API para o sistema de feedback de produtos.',
            contact: {
                name: 'Caunã Weber', // Atualizado com seu nome do GitHub
                url: 'https://github.com/caunaweber'
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        components: {
            // 👇 ADICIONADO: Define como a autenticação funciona
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token'
                }
            },
            // Seus schemas reutilizáveis
            schemas: {
                Usuario: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        role: { type: 'string', enum: ['admin', 'user'] }
                    }
                },
                Produto: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        nome: { type: 'string' },
                        descricao: { type: 'string' },
                        categoria: { type: 'string' },
                        imagem: { type: 'string' },
                        mediaAvaliacoes: { type: 'number', format: 'float', description: 'Média de avaliações do produto' }
                    }
                },
                Avaliacao: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        comentario: { type: 'string' },
                        avaliacao: { type: 'integer', description: 'Nota de 1 a 5' },
                        produtoId: { type: 'integer' },
                        userId: { type: 'integer' }
                    }
                }
            }
        }
    },
    apis: ['./routes/router.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;

