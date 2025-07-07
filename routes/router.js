const express = require('express');
const router = express.Router();

const upload = require('../config/multer');

const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const authMiddleware = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/produtoController');
const helloWorld = require('../controllers/helloController');
const dashboardController = require('../controllers/dashboardController');
const avaliacaoController = require('../controllers/avaliacaoController');
const relatorioController = require('../controllers/relatorioController');

/**
 * @swagger
 * /tokentest:
 *   get:
 *     summary: Testa token JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Retorna mensagem de sucesso
 */
router.get('/tokentest', authMiddleware.authenticateToken, helloWorld.helloWorld);

/**
 * @swagger
 * /admtest:
 *   get:
 *     summary: Testa token e acesso de administrador
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso concedido para admin
 */
router.get('/admtest', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, helloWorld.helloWorld);

router.get('/', (req, res) => { res.redirect('/login') });

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/users', authMiddleware.authenticateToken, userController.getAllUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário encontrado
 */
router.get('/users/:id', authMiddleware.authenticateToken, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put('/users/:id', authMiddleware.authenticateToken, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuário deletado
 */
router.delete('/users/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, userController.deleteUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               senha: { type: string }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post('/login', loginController.login);

router.get('/login', (req, res) => { res.render('login', { message: null, type: null }); });

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Realiza logout do usuário
 */
router.get('/logout', loginController.logout);

router.get('/cadastro', (req, res) => { res.render('cadastro', { message: null }); });

/**
 * @swagger
 * /cadastro:
 *   post:
 *     summary: Cria novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               email: { type: string }
 *               senha: { type: string }
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/cadastro', userController.createUser);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Exibe a dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Renderiza a dashboard
 */
router.get('/dashboard', authMiddleware.authenticateToken, dashboardController.renderDashboard);

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Renderiza produtos (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get('/produtos', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.renderProdutos);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastra produto (admin)
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               descricao: { type: string }
 *               categoria: { type: string }
 *               imagem: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Produto criado
 */
router.post('/produtos', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, upload.single("imagem"), produtoController.createProduto);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     summary: Atualiza um produto (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: string }
 *               descricao: { type: string }
 *               categoria: { type: string }
 *               imagem: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Produto atualizado
 */
router.put('/produtos/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, upload.single("imagem"), produtoController.updateProduto);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produto deletado
 */
router.delete('/produtos/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.deleteProduto);

/**
 * @swagger
 * /produtos/{productId}/reviews:
 *   get:
 *     summary: Exibe avaliações de um produto
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações
 */
router.get('/produtos/:productId/reviews', authMiddleware.authenticateToken, avaliacaoController.renderAvaliacoes);

/**
 * @swagger
 * /myReview/{productId}:
 *   get:
 *     summary: Retorna avaliação do usuário logado para um produto
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avaliação do usuário
 */
router.get('/myReview/:productId', authMiddleware.authenticateToken, avaliacaoController.getMyAvaliacao);

/**
 * @swagger
 * /review/{productId}:
 *   get:
 *     summary: Retorna todas as avaliações de um produto
 *   post:
 *     summary: Cria uma nova avaliação para um produto
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nota: { type: integer }
 *               comentario: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 */
router.get('/review/:productId', authMiddleware.authenticateToken, avaliacaoController.getAvalicaoByProductId);
router.post('/review/:productId', authMiddleware.authenticateToken, avaliacaoController.createAvaliacao);

/**
 * @swagger
 * /relatorios:
 *   get:
 *     summary: Exibe opções de relatórios (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Página de relatórios
 */
router.get('/relatorios', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, relatorioController.renderRelatorios);

/**
 * @swagger
 * /relatorios/{tipo}/print:
 *   get:
 *     summary: Gera relatório para impressão
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema: { type: string }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório gerado
 */
router.get('/relatorios/:tipo/print', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, relatorioController.printRelatorio);

module.exports = router;
