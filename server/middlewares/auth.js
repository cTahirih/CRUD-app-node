/*******
*  Validate token
* */
const jwt = require('jsonwebtoken');

let validateToken = (req, resp, next) => {
  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (onerror, decoded) => {
    if (onerror) {
      return resp.status(401).json({
        ok: false,
        error: 'Token no válido'
      });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = {
  validateToken
}
