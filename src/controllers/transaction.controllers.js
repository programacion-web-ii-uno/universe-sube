const transactionServices = require("../services/transaction.services.js");

async function getAll(req, res) {
    await transactionServices.getAll(req.data.pagination)
        .then(founds => {
            res.status(200).json(founds);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}

/**
 * @description find transactions with filters and pagination
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function find(req, res) {
    await transactionServices.find(req.data.filters, req.data.pagination)
        .then((founds) => {
            res.status(200).json(founds);
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}

/**
 * @description find the transaction unique by id
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
function findByID(req, res) {
    const { id } = req.data.params;
    transactionServices.findByID(id)
        .then(found => {
            if (found) {
                res.status(200).json(found);
            } else {
                res.status(404).json({ error: "Transaction not found" });
            }
        })
        .catch((error) => {
            const STATUS_CODE = 500;
            res.status(STATUS_CODE).json({ error: { message: error.message, status: STATUS_CODE } });
        });
}

/**
 * @param {import('express').Request} req
 */
function hasFilter(req) {
    return ("filters" in req.data && 1 <= Object.keys(req.data.filters).length);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function get(req, res) {

    try {
        if(hasFilter(req)) {
            // get transaction with filters and pagination
            await find(req, res);
        }
        else {
            // get all transaction with pagination
            await getAll(req, res);
        }
    } catch (error) {
        if(error.message.includes("[ERR_FIELD_QUERY_INVALID]")) {
            // Bad Request
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = { get, findByID }
