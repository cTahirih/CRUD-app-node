const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
  key: {
    type: String,
    default: shortid.generate
  },
  description: {
    type: String,
    unique: true,
    required: [true, 'Ingrese una categoría']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Category', categorySchema);
