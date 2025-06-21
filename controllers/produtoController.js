const Produto = require('../model/produto');

exports.createProduto = async (req, res) => {
  const { nome, descricao, categoria } = req.body;
  try {
    await Produto.create({ nome, descricao, categoria });
    
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
  const {nome, descricao, categoria} = req.body;
  const id = req.params.id;

  try{
    const produto = await Produto.findByPk(id)

    if(!produto) res.status(404).json({message: "Produto não encontrado."});

    await produto.update({
      nome: nome,
      descricao: descricao,
      categoria: categoria
    })

    res.status(200).json({message: "Produto atualizado."})
  } catch(err){
    console.error(err);
    res.status(500).json({message: "Erro interno ao atualizar produto.", erro: err})
  }
}

exports.deleteProduto = async (req, res) => {
  const id = req.params.id;

  try{
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await produto.destroy();
    res.status(200).json({ message: 'Produto deletado com sucesso' });

  } catch(err) {
     console.error('Erro ao deletar produto:', err);
     res.status(500).json({ message: 'Erro ao deletar produto' });
  }
}

exports.renderProdutos = async (req, res) => {
  const produtos = await Produto.findAll();
  res.render('produtos', {
    user: req.user,
    produtos,
    message: null,
    type: null
  });
};