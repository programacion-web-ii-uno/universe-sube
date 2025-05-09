const express = require('express');
const Router = express.Router();
const transactionController = require('../controllers/transaction.controllers.js');
const transactionMiddleware = require('../middlewares/transaction.middlewares.js');

// En resumen las actividades serian las minimas de un CRUD:
// GET sube/get/?limit=20&offset=1 devuelve todas las transacciones con paginación | aca entra la magia de los filtros
// Ejemplo:
//     > GET sube/get/?date=24-04-2025&limit=20&offset=1 |-> Devuelve todas las transacciones del dia 24/4/25
// GET sube/get/:id devuelve la transacción con la ID especifica
// POST sube/get y en el body el objeto transacción para guardar la transacción en el archivo
// PUT sube/get/:id y en el body el objeto transacción nuevo que reemplazará por completo a la transacción con el id especificado en la URL
// PATCH sube/get/:id y en el body el objeto transacción nuevo que reemplazará parcialmente a la transacción con el id especificado en la URL
// DELETE sube/get/:id borra una transacción con el ID especificado

Router.get('/get', transactionMiddleware.validateFilters, transactionController.get);
// Router.get('/get/:id', transactionController.findByID);
// Router.patch('/modificate/:id', transactionController.modificate);
// Router.put('/get/update/:id', transactionController.update);
// Router.delete('/get/delete/:id', transactionController.delete);

module.exports = { Router };
