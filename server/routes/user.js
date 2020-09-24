const express = require('express');
const User = require('../models/user');
const { validateToken } = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

app.get('/users', validateToken, (req, res) => {

  let from = Number(req.query.from) || 0;
  let limitFromPage = Number(req.query.limit) || 5;

  User.find({ state: true }, 'name email role state googleAccount image')
      .skip(from) //desde donde se obtiene la lista de usuarios
      .limit(limitFromPage) // el total que se quiere obtener
      .exec((onerror, users) => {
        if (onerror) {
          res.status(400).json({
            ok: false,
            error: onerror
          })
        }

        User.countDocuments({ state: true }, (onerror, countRegister) => {
          res.json({
            ok: true,
            users,
            total: countRegister
          });
        });
      });
});

app.post('/user', validateToken, (req, res) => {

  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10), // encriptacion
    role: body.role
  });

  user.save((onerror, userDB) => {
    if (onerror) {
      res.status(400).json({
        ok: false,
        error: onerror
      })
    }

    res.json({
      ok: true,
      user: userDB
    });
  });

});

app.put('/user/:id', validateToken, (req, res) => {
  let id = req.params.id;
  let body = _.pick( // filtramos solo los parametros que se quiere actualizar
    req.body,
    ['name', 'email', 'image', 'role', 'state']
  );

  User.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
      runValidators: true
    },
    (onerror, userDB) =>{
    if (onerror) {
      res.status(400).json({
        ok: false,
        error: onerror
      })
    }

    res.json({
      ok: true,
      user: userDB
    });
  });

});

app.delete('/user/:id', validateToken, (req, res) => {
  let id = req.params.id;

  let changeState = {
    state: false
  };
  User.findByIdAndUpdate(
    id,
    changeState,
    {
      new: true
    },
    (onerror, userDelete) => {
    if (onerror) {
      res.status(400).json({
        ok: false,
        error: onerror
      })
    }

    if (!userDelete) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Usuario no encontrado'
        }
      })
    }

    res.json({
      ok: true,
      user: userDelete
    })
  });
});

module.exports = app;
