const mongoose = require('mongoose');

const cartaoCreditoSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  expiration: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
});

const CreditCard = mongoose.model('CartaoCredito', cartaoCreditoSchema);

module.exports = CreditCard;


