const express = require('express');
const Router = express.Router();
const transactionController = require('../controllers/transaction.controllers.js');

Router.get('/get', transactionController.get);
// Router.get('/get/:id', transactionController.getByID);

module.exports = { Router };
