const transactionModel = require("../models/transaction.model.js");

/**
 *
 * @param {object} Pagination parameters to getAll
 * @param {number} Pagination.Limit Pagination Param
 * @param {number} Pagination.Offset Pagination Param
 */
async function getAll({ Limit, Offset }) {
    try {
        return await transactionModel.getAll({ Limit, Offset });
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 *
 * @param {object} Filters parameters of find
 * @param {number} Limit Pagination Param
 * @param {number} Offset Pagination Param
 */
async function find(Filters, { Limit, Offset }) {
    try {
        return await transactionModel.find(Filters, { Limit, Offset });
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports = { getAll, find };
