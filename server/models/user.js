const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let roleValid = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol válido'
}

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es requerido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  image: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: roleValid
  },
  state: {
    type: Boolean,
    default: true
  },
  googleAccount: {
    type: Boolean,
    default: false
  }
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  delete userObject.password;
  return userObject;
}

userSchema.plugin( uniqueValidator, {
  message: 'Existe un error en el campo: {PATH}'
});

module.exports = mongoose.model('User', userSchema);

