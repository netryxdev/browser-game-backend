const jwt = require('jsonwebtoken');

// Verifique o token em cada solicitação
app.use((req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    // Se o token estiver correto, salve o ID do usuário na solicitação para uso posterior
    req.userId = decoded.id;
    next();
  });
});
