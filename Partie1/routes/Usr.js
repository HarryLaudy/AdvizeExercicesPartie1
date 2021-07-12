const express = require('express');
const routeur = express.Router();
const Schema = require('../Schema');

routeur.get('/', async (req, res) => {
    try {
        const users = await Schema.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err});
    }
});

routeur.post('/', async (req, res) => {
    const usr = new Schema({
        nom: req.body.nom,
        prenom: req.body.prenom,
        date: req.body.naissance
    });
    try {
        const savedUsr = await usr.save()
        res.json(savedUsr);
    } catch (err) {
        res.json({ message: err});
    }
});

module.exports = routeur;