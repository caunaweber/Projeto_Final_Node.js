const User = require("../models/user");
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
      sameSite: 'strict',
      maxAge: 3600000 
    })

    res.redirect('dashboard')

  } catch (err) {
    res.status(500).render('login', {message: 'Erro ao logar', type: 'danger'});
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies.token;

  if(!token){
    return res.status(404).json({message: "Nenhum usuário logado"})
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.redirect('/login')
}