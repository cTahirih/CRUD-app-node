/*******
*  Validate token
* */
const jwt = require('jsonwebtoken');

let validateToken = (req, resp, next) => {
  let token = req.get('token');
  console.log(token);

  jwt.verify(token, process.env.SEED, (onerror, decoded) => {
    if (onerror) {
      return resp.status(401).json({
        ok: false,
        error: onerror
      });
    }

    req.user = decoded.user;
    next()
  })
  next();
};

module.exports = {
  validateToken
}
