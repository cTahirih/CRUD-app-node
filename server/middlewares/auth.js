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

/*******
 *  Verify admin role
 * */

let verifyAdminRole = (req, resp, next) => {
  let user = req.user;

  if (user.role === 'ADMIN_ROLE') {
    next();
  } else {
    return resp.json({
      ok: false,
      error: {
        message: 'El usuario no es administrador'
      }
    });
  }

}

module.exports = {
  validateToken,
  verifyAdminRole
}
