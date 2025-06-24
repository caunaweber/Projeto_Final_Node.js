const Produto = require('../models/produto');

exports.renderDashboard = async (req, res) => {
    try {
        const produtos = await Produto.findAll();
        res.render('dashboard', { user: req.user, produtos, message: null, type: null });
    } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        res.status(500).render('dashboard', {
        user: req.user,
        produtos: [],
        message: 'Erro ao carregar produtos',
        type: 'danger'
        });
    }
}