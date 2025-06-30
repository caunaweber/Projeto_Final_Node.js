const { Produto, Avaliacao, sequelize } = require("../models");

exports.renderDashboard = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: produtos } = await Produto.findAndCountAll({
            limit,
            offset,
            order: [["data_criacao", "DESC"]],
             attributes: {
                include: [
                    [sequelize.fn('AVG', sequelize.col('avaliacoes.avaliacao')), 'mediaAvaliacoes'],
                ]
            },
            include: [{
                model: Avaliacao,
                as: 'avaliacoes', 
                attributes: []
            }],
            group: ['Produto.id'],
            subQuery: false
        });

        const totalPages = Math.ceil(count.lenght / limit);

        res.render("dashboard", {
            user: req.user,
            produtos,
            message: null,
            type: null,
            totalPages,
            currentPage: page,

        });
    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        res.status(500).render("dashboard", {
            user: req.user,
            produtos: [],
            message: "Erro ao carregar produtos",
            type: "danger",
            totalPages: 0,
            currentPage: page,
        });
    }
};
