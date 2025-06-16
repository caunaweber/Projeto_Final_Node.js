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
      req.session.message = "Usuário não encontrado";
      req.session.type = "danger";
      return res.redirect('/login');
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      req.session.message = "Senha incorreta";
      req.session.type = "warning";
      return res.redirect('/login');
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    req.session.token = token;
    req.session.message = user.role === "admin" ? "Logado como ADM" : "Login realizado com sucesso";
    req.session.type = "success";

    console.log(token);

    return res.redirect('/login');

  } catch (err) {
    res.status(500).json({ message: "erro ao logar", erro: err });
  }
};
