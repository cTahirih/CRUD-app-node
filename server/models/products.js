const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const productSchema = new Schema({
  key: {
    type: String,
    default: shortid.generate
  },
  productName: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  priceUnitary: {
    type: Number,
    required: [true, 'El precio únitario es necesario']
  },
  description: {
    type: String,
    required: false
  },
  available: {
    type: Boolean,
    required: true,
    default: false
  },
  image: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  categoryId: {
    type: Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


module.exports = mongoose.model('Product', productSchema);
