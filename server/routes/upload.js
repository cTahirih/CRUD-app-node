const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const User = require('../models/user');
const Product = require('../models/products');
const users = 'users';
const products = 'products';

app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:type/:id', (req, resp) => {
  const type = req.params.type;
  const id = req.params.id;

  if (!req.files) {
    return resp.status(400).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 2,
        description: 'No se seleccionado ningún archivo'
      }
    });
  }

  let allowedTypes = [products, users];

  if (allowedTypes.indexOf(type) < 0) {
    return resp.status(400).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 3,
        description: 'Las tipos permitidos son' + allowedTypes.join(', ')
      }
    });
  }

  let fileUpload = req.files.file;
  let splitNameFile = fileUpload.name.split('.');
  let extension = splitNameFile[splitNameFile.length - 1];

  let allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

  if (allowedExtensions.indexOf(extension) < 0) {
    return resp.status(400).json({
      data: {},
      errorManager: {
        status: resp.statusCode,
        errorNumber: 3,
        description: 'Las extensiones permitidas son' + allowedExtensions.join(', ')
      }
    });
  }

  const nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`

  fileUpload.mv(`uploads/${type}/${nameFile}`, (err) => {
    if (err) {
      return resp.status(500).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: err
        }
      });
    }

    type === users ?
      imageUser(id, resp, nameFile) :
      imageProduct(id, resp, nameFile);
  });
});

const imageUser = (id, resp, nameFile) => {
  User.findById(id, (onerror, userDB) => {
    if (onerror) {
      deleteFile(nameFile, users);
      return resp.status(500).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: onerror
        }
      });
    }

    if (!userDB) {
      deleteFile(nameFile, users);
      return resp.status(400).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: 'Usuario no existe'
        }
      });
    }

    deleteFile(userDB.image, users);

    userDB.image = nameFile;

    userDB.save((onerror, userDBSave) => {
      resp.status(200).json({
          data: {
            user: userDB
          },
          errorManager: {
            status: resp.statusCode,
            errorNumber: 0,
            description: 'Archivo subido con éxito'
          }
        });
      });
    });
};

const imageProduct = (id, resp, nameFile) => {
  Product.findById(id, (onerror, productDB) => {
    if (onerror) {
      deleteFile(nameFile, products);
      return resp.status(500).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: onerror
        }
      });
    }

    if (!productDB) {
      deleteFile(nameFile, products);
      return resp.status(400).json({
        data: {},
        errorManager: {
          status: resp.statusCode,
          errorNumber: 2,
          description: 'Producto no existe'
        }
      });
    }

    deleteFile(productDB.image, products);

    productDB.image = nameFile;

    productDB.save((onerror, productSave) => {
      resp.status(200).json({
        data: {
          product: productSave
        },
        errorManager: {
          status: resp.statusCode,
          errorNumber: 0,
          description: 'Archivo subido con éxito'
        }
      });
    });
  });
}

const deleteFile = (nameImage, type) => {
  let pathURLImage = path.resolve(__dirname, `../../uploads/${type}/${nameImage}`);
  if (fs.existsSync(pathURLImage)) {
    fs.unlinkSync(pathURLImage);
  }
}
module.exports = app;
