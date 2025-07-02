const { User, Produto, Avaliacao, sequelize } = require("../models");

exports.renderRelatorios = async (req, res) => {
    try {
        const [usuarios, produtos] = await Promise.all([
            User.findAll({
                attributes: ['id', 'username', 'role'],
                order: [['id', 'ASC']]
            }),
            Produto.findAll({
                order: [['id', 'ASC']],
                attributes: {
                    include: [
                        [sequelize.fn('AVG', sequelize.col('avaliacoes.avaliacao')), 'mediaAvaliacoes']
                    ]
                },
                include: [{
                    model: Avaliacao,
                    as: 'avaliacoes',
                    attributes: []
                }],
                group: ['Produto.id']
            })
        ]);

        res.render("relatorios", {
            user: req.user,
            usuarios: usuarios,
            produtos: produtos
        });
    }
    catch (error) {
        console.error("Erro ao renderizar relatório:", error);
        res.render("dashboard", { 
            user: req.user,
            produtos: [],
            totalPages: 0,
            currentPage: 1,
            message: "Erro ao carregar os dados do relatório.",
            type: 'danger'
        });
    }
}

exports.printRelatorio = async (req, res) => {
    const { tipo } = req.params;
    let dados;
    let titulo;

    try {
        if (tipo === 'usuarios') {
            titulo = "Relatório de Usuários";
            dados = await User.findAll({ attributes: ['id', 'username', 'role'], order: [['id', 'ASC']] });
        } else if (tipo === 'produtos') {
            titulo = "Relatório de Produtos";
            dados = await Produto.findAll({
                attributes: {
                    include: [
                        [sequelize.fn('AVG', sequelize.col('avaliacoes.avaliacao')), 'mediaAvaliacoes']
                    ]
                },
                include: [{
                    model: Avaliacao,
                    as: 'avaliacoes',
                    attributes: []
                }],
                group: ['Produto.id']
            });
        } else {
            return res.status(404).send('Tipo de relatório não encontrado.');
        }

        res.render("relatorio-print", {
            user: req.user,
            titulo: titulo,
            dados: dados,
            tipo: tipo,
            dataGeracao: new Date(),
        });

    } catch (error) {
        console.error(`Erro ao gerar relatório para impressão de ${tipo}:`, error);
        res.status(500).send('Erro ao gerar o relatório.');
    }
}