const express = require('express')
const router = express.Router();

const upload = require('../config/multer');

const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController')
const authMiddleware = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/produtoController')
const helloWorld = require('../controllers/helloController')
const dashboardController = require('../controllers/dashboardController')
const avaliacaoController = require('../controllers/avaliacaoController')

router.get('/tokentest', authMiddleware.authenticateToken, helloWorld.helloWorld)
router.get('/admtest', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, helloWorld.helloWorld)

router.get('/', (req, res) => { res.redirect('/login') })

router.get('/users', authMiddleware.authenticateToken, userController.getAllUser);
router.get('/users/:id', authMiddleware.authenticateToken, userController.getUserById);
router.put('/users/:id', authMiddleware.authenticateToken, userController.updateUser);
router.delete('/users/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, userController.deleteUser);

router.post('/login', loginController.login);
router.get('/login', (req, res) => { res.render('login', { message: null, type: null }); });

router.get('/logout', loginController.logout)

router.get('/cadastro', (req, res) => { res.render('cadastro', { message: null }); });
router.post('/cadastro', userController.createUser)

router.get('/dashboard', authMiddleware.authenticateToken, dashboardController.renderDashboard);

router.get('/produtos', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.renderProdutos);
router.post('/produtos', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, upload.single("imagem"), produtoController.createProduto);
router.put('/produtos/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, upload.single("imagem"), produtoController.updateProduto);
router.delete('/produtos/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.deleteProduto)

router.get('/produtos/:productId/reviews', authMiddleware.authenticateToken, avaliacaoController.renderAvaliacoes);

router.get('/myReview/:productId', authMiddleware.authenticateToken, avaliacaoController.getMyAvaliacao);
router.get('/review/:productId', authMiddleware.authenticateToken, avaliacaoController.getAvalicaoByProductId);
router.post('/review/:productId', authMiddleware.authenticateToken, avaliacaoController.createAvaliacao);


module.exports = router;