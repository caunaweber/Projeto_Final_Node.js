const Avaliacao = require('../models/avaliacao');
const Produto = require('../models/produto');

exports.createReview = async (req, res) => {
    try {
        const { nota, comentario, produtoId } = req.body;
        const userId = req.user.id;

        const produto = await Produto.findByPk(produtoId);

        const review = await Avaliacao.create({
            nota,
            comentario,
            produto,
            userId
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}