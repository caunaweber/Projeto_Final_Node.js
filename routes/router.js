const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController')
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/users', userController.createUser);
router.get('/users', authMiddleware.authenticateToken, userController.getAllUser);
router.get('/users/:id', authMiddleware.authenticateToken, userController.getUserById);
router.put('/users/:id', authMiddleware.authenticateToken, userController.updateUser);
router.delete('/users/:id', authMiddleware.authenticateToken, authMiddleware.authorizeAdmin, userController.deleteUser);

router.post('/login', loginController.login);
router.get('/login', (req, res) => {
  const message = req.session.message;
  const type = req.session.type;

  req.session.message = null;
  req.session.type = null;

  res.render('login', { message, type });
});

module.exports = router;