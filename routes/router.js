const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController')
const authMiddleware = require('../middlewares/authMiddleware');
const helloWorld = require('../controllers/helloController')

router.get('/', (req, res) => {res.redirect('/login')})

router.post('/users', userController.createUser);
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

router.get('/tokentest', authMiddleware.authenticateToken, helloWorld.helloWorld)
router.get('/admtest', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, helloWorld.helloWorld)

module.exports = router;