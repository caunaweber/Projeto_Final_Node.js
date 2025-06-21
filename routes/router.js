const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController')
const authMiddleware = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/produtoController')
const helloWorld = require('../controllers/helloController')

router.get('/', (req, res) => {res.redirect('/login')})

router.get('/users', authMiddleware.authenticateToken, userController.getAllUser);
router.get('/users/:id', authMiddleware.authenticateToken, userController.getUserById);
router.put('/users/:id', authMiddleware.authenticateToken, userController.updateUser);
router.delete('/users/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, userController.deleteUser);

router.post('/login', loginController.login);
router.get('/login', (req, res) => {res.render('login', { message: null, type: null });});

router.get('/logout', loginController.logout)

router.get('/cadastro', (req, res) => {res.render('cadastro', { message: null });});
router.post('/cadastro', userController.createUser)

router.get('/dashboard', authMiddleware.authenticateToken, (req, res) => {res.render('dashboard',{user: req.user})})

router.get('/produtos', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.renderProdutos);
router.post('/produtos', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.createProduto);
router.put('/produtos/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.updateProduto);
router.delete('/produtos/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, produtoController.deleteProduto)

router.get('/tokentest', authMiddleware.authenticateToken, helloWorld.helloWorld)
router.get('/admtest', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, helloWorld.helloWorld)

module.exports = router;