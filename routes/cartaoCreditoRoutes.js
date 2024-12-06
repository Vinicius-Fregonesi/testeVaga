const express = require('express');
const CreditCard = require('../models/cartaoCredito');
const User = require('../models/cliente');
const authMiddleware = require('../middlewares/autenticacaoMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const card = await CreditCard.findById(req.body.id);
    if (!card) {
      const newCard = new CreditCard({
        client: req.user.id,
        number: req.body.number,
        expiration: req.body.expiration,
        cvv: req.body.cvv,
      });

      await newCard.save();

      await User.findByIdAndUpdate(req.user.id, { $push: { creditCards: newCard._id } });
      return res.status(201).json({ message: 'Cartão de crédito salvo com sucesso!', cardId: newCard._id });
    } else {
      await CreditCard.findByIdAndUpdate(
        req.body.id,
        {
          client: req.user.id,
          number: req.body.number,
          expiration: req.body.expiration,
          cvv: req.body.cvv,
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ message: 'Cartão de crédito atualizado com sucesso!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Erro ao salvar o cartão de crédito!', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    var creditCards = await CreditCard.find({ client: req.user.id });
    res.status(200).json(creditCards);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erro ao obter os cartões de crédito!', error });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const cardId = req.params.id;
    const card = await CreditCard.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Cartão de crédito não encontrado' });
    }
    if (card.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir este cartão' });
    }
    await CreditCard.findByIdAndDelete(cardId);
    await User.findByIdAndUpdate(req.user.id, { $pull: { creditCards: cardId } });

    res.status(200).json({ message: 'Cartão de crédito removido com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Erro ao remover o cartão de crédito!', error: error.message });
  }
});


module.exports = router;
