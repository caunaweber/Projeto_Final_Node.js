const Produto = require("../models/produto");

exports.renderDashboard = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    try {
        const { count, rows: produtos } = await Produto.findAndCountAll({
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        const totalPages = Math.ceil(count / limit);

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
        });
    }
};
