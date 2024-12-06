const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/cliente');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = new User({ username, password });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();

        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: newUser._id });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao registrar usuário!', error });
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha inválida!' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.json({ token });
    } catch (error) {
        console.error('Erro no login:', error.message);
        return res.status(500).json({ message: 'Erro no servidor!', error: error.message });
    }
});
module.exports = router;
