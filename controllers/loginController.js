const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const user = await User.findOne({
      where: { usuario },
      attributes: ["id", "usuario", "senha", "role"],
    });

    if (!user) {
      return res.render('login', { message: 'Usuário não encontrado', type: 'danger' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.render('login', { message: 'Senha errada', type: 'warning' });
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 
    })

    const message =
      user.role === "admin" ? "Logado como ADM" : "Login realizado com sucesso";

    res.render('login', {message: message, type: "success"})

  } catch (err) {
    res.status(500).json({ message: "erro ao logar", erro: err });
  }
};