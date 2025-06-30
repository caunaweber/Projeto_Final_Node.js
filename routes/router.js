const express = require('express')
const router = express.Router();

const upload = require('../config/multer');

const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController')
const authMiddleware = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/produtoController')
const helloWorld = require('../controllers/helloController')
const dashboardController = require('../controllers/dashboardController')

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

router.get('/tokentest', authMiddleware.authenticateToken, helloWorld.helloWorld)
router.get('/admtest', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, helloWorld.helloWorld)

const { User, Produto, Avaliacao } = require('../models'); // Importe do index.js

// ...

router.get('/teste-associacao', async (req, res) => {
  try {
    // 1. Criar um usuário e um produto
    const user = await User.create({ username: 'testuser', senha: 'password123' });
    const produto = await Produto.create({ nome: 'Produto Teste', descricao: 'Desc', categoria: 'Cat' });

    // 2. Criar uma avaliação associando os dois
    const avaliacao = await Avaliacao.create({
      comentario: 'Muito bom!',
      avaliacao: 5,
      userId: user.id,
      produtoId: produto.id
    });

    // 3. Buscar o produto e incluir suas avaliações
    const produtoComAvaliacoes = await Produto.findByPk(produto.id, {
      include: [{
        model: Avaliacao,
        as: 'avaliacoes', // O 'as' que você definiu
        include: [{
          model: User,
          as: 'usuario', // O 'as' que você definiu
          attributes: ['username'] // Para não mostrar a senha
        }]
      }]
    });

    res.json(produtoComAvaliacoes);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;