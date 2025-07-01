const { Avaliacao, User } = require('../models');

exports.createAvaliacao = async (req, res) => {
    const { productId } = req.params;
    const { avaliacao, comentario } = req.body;
    const userId = req.user.id;

    try {
        const novaAvaliacao = await Avaliacao.create({
            produtoId: productId,
            userId: userId, 
            avaliacao: avaliacao,
            comentario: comentario
        });
        res.status(201).json({
            message: 'Avaliação criada com sucesso',
            avaliacao: novaAvaliacao
        });
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        return res.status(500).json({ message: 'Erro ao criar avaliação' });
    }
};

exports.getAvalicaoByProductId = async (req, res) => {
    const { productId } = req.params;

    const limit = req.query.limit ? parseInt(req.query.limit) : 3;

    try {
        const { count, rows: avaliacoes } = await Avaliacao.findAndCountAll({
            where: { produtoId: productId },
            include: [{ model: User, as: "usuario", attributes: ['username'] }],
            limit: limit,
            order: [['data_criacao', 'DESC']],
        });
        res.status(200).json({ count, rows: avaliacoes });
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        return res.status(500).json({ message: 'Erro ao buscar avaliações' });
    }
};

exports.getMyAvaliacao = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const avaliacao = await Avaliacao.findOne({
            where: { 
                produtoId: productId, 
                userId: userId
            }
        });

        if (!avaliacao) {
            return res.status(404).json({ message: 'Nenhuma avaliação sua para este produto.' });
        }
        
        res.status(200).json(avaliacao);
    } catch (error) {
        console.error('Erro ao buscar sua avaliação:', error);
        return res.status(500).json({ message: 'Erro ao buscar sua avaliação' });
    }
};

exports.updateAvaliacao = async (req, res) => {
    const { id } = req.params;
    const { avaliacao, comentario } = req.body;
    const userId = req.user.id;
    try {
        const avaliacaoParaAtualizar = await Avaliacao.findOne({ where: { id: id, userId: userId } });

        if (!avaliacaoParaAtualizar) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }

        avaliacaoParaAtualizar.avaliacao = avaliacao;
        avaliacaoParaAtualizar.comentario = comentario;
        await avaliacaoParaAtualizar.save();

        res.status(200).json({ message: 'Avaliação atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        return res.status(500).json({ message: 'Erro ao atualizar avaliação' });
    }
};

exports.deleteAvaliacao = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const avaliacao = await Avaliacao.findOne({ where: { id: id, userId: userId } });

        if (!avaliacao) {
            return res.status(404).json({ message: 'Avaliação não encontrada' });
        }
        await avaliacao.destroy();
        res.status(200).json({ message: 'Avaliação deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        return res.status(500).json({ message: 'Erro ao deletar avaliação' });
    }
};
