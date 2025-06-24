const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  const { usuario, senha } = req.body || {};

  try {

    if (!usuario || !senha) {
      return res.status(400).render('cadastro', {message: "Usuario e senha nao podem ser nulos", type: 'danger'})
    }
    
    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = await User.create({ usuario, senha: hashedPassword });
    res.status(201).render('login', {message: "Usuário criado com sucesso. ", type: 'success'} )
  } catch (err) {
    res.status(500).render('cadastro', { message: `Erro ao criar usuário ${err}`, type: 'danger'})
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "usuario", "createdAt"],
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar usuários", erro: err });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "usuario", "createdAt", "updatedAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar usuario", erro: err });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { usuario, senha } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    const hashedPassword = senha ? await bcrypt.hash(senha, 10) : user.senha;

    await user.update({
      usuario: usuario || user.usuario,
      senha: hashedPassword,
    });

    res.json({ message: "Usuario atualizado com sucesso", usuario: user });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar usuario", erro: err });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await user.destroy();
    res.status(202).json({message:"Usuario deletado"})
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar usuario", erro: err });
  }
};
