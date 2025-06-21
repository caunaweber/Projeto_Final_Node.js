const jwt = require('jsonwebtoken')

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).render('login', {message: 'Usuário deslogado', type: 'danger'})
    }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(500).render('login', {message: 'Usuário deslogado', type: 'danger'});
  }
}

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado: apenas administradores" });
  }
  next();
}