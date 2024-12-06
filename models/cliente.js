const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creditCards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CreditCard' }]  
},{timestamps:true});

module.exports= mongoose.model('Cliente', clienteSchema);