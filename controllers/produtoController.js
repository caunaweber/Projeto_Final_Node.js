const Produto = require('../models/produto');
const fs = require('fs');
const path = require('path');

exports.createProduto = async (req, res) => {
  const { nome, descricao, categoria } = req.body;
  try {
    
    if(req.file){
      let imagem = "uploads/" + req.file.filename;
      await Produto.create({ nome, descricao, categoria, imagem });
    }
    else{await Produto.create({ nome, descricao, categoria });}
    
    res.redirect('/produtos');

  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    res.render('produtos', {
      user: req.user,
      produtos: await Produto.findAll(),
      message: 'Erro ao cadastrar produto',
      type: 'danger'
    });
  }
};

exports.updateProduto = async (req, res) => {
  const { nome, descricao, categoria } = req.body;
  const id = req.params.id;

  try {
    const produto = await Produto.findByPk(id)

    if (!produto) return res.status(404).json({ message: "Produto não encontrado." });

    let imagem = produto.imagem;

    if (req.file) {
      if (produto.imagem && !produto.imagem.startsWith("imgs/")) {
        const imagemAntigaPath = path.join(__dirname, "..", "public", produto.imagem);
        fs.unlink(imagemAntigaPath, (err) => {
          if (err) {
            console.error("Erro ao deletar imagem antiga:", err);
          }
        });
      }

      imagem = "uploads/" + req.file.filename;
    }

    await produto.update({
      nome: nome,
      descricao: descricao,
      categoria: categoria,
      imagem: imagem,
    })

    res.status(200).json({ message: "Produto atualizado." })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno ao atualizar produto.", erro: err })
  }
}

exports.deleteProduto = async (req, res) => {
  const id = req.params.id;

  try {
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (produto.imagem && !produto.imagem.startsWith('imgs/')) {
      const imagemPath = path.join(__dirname, '..', 'public', produto.imagem);
      fs.unlink(imagemPath, (err) => {
        if (err) {
          console.error('Erro ao deletar imagem:', err);
        }
      });
    }

    await produto.destroy();
    res.status(200).json({ message: 'Produto deletado com sucesso' });

  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
}

exports.renderProdutos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: produtos } = await Produto.findAndCountAll({
      limit,
      offset,
      order: [["data_criacao", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);
    res.render('produtos', {
      user: req.user,
      produtos,
      message: null,
      type: null,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).render('produtos', {
      user: req.user,
      produtos: [],
      message: 'Erro ao carregar produtos',
      type: 'danger',
      totalPages: 0,
      currentPage: page,
    });
  }
}  