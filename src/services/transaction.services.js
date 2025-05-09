const transactionModel = require("../models/transaction.model.js");

/**
 * Busca transacciones con filtros y paginación.
 * @param {object} Filters - Filtros de búsqueda.
 * @param {object} Pagination - Parámetros de paginación.
 * @param {number} Pagination.Limit - Límite de resultados.
 * @param {number} Pagination.Offset - Desplazamiento de resultados.
 */
async function find(Filters, { Limit, Offset }) {
    try {
        return await transactionModel.find(Filters, { Limit, Offset });
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Agrega una nueva transacción.
 * @param {object} transaction - Datos de la transacción a agregar.
 */
async function add(transaction) {
    try {
        return await transactionModel.add(transaction);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Actualiza una transacción existente por ID.
 * @param {string|number} id - ID de la transacción.
 * @param {object} data - Datos actualizados de la transacción.
 */
async function update(id, data) {
    try {
        return await transactionModel.update(id, data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Elimina una transacción por ID.
 * @param {string|number} id - ID de la transacción a eliminar.
 */
async function _delete(id) {
    try {
        return await transactionModel.delete(id);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = { find, add, update, delete: _delete };
