const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, resp) => {
  let body = req.body;

  User.findOne({
    email: body.email
  }, (onerror, userDB) => {
    if (onerror) {
      return resp.status(500).json({
        ok: false,
        error: onerror
      });
    }

    if (!userDB) {
      return resp.status(400).json({
        ok: false,
        error: {
          message: 'Usuario o contraseña incorrecto'
        }
      });
    }

    if (!userDB.state) {
      return resp.status(400).json({
        ok: false,
        error: {
          message: 'El usuario no está activo'
        }
      });
    }

    if (!bcrypt.compareSync(
      body.password, userDB.password
    )) {
      return resp.status(400).json({
        ok: false,
        error: {
          message: 'Usuario o contraseña incorrecto'
        }
      });
    }

    let token = jwt.sign({
      user: userDB
    }, 'secret-dev', {
      expiresIn: process.env.EXP_TOKEN
    });

    resp.json(({
      ok: true,
      user: userDB,
      token
    }));

  });

});

module.exports = app;
