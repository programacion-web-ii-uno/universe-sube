const transactionServices = require("../services/transaction.services.js");

/**
 * @description find transactions with filters and pagination
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function find(req, res) {
    const Filters = req.data.filters ?? {}
    await transactionServices.find(Filters, req.data.pagination)
        .then((founds) => {
            const STATUS_CODE = 200;
            res.status(STATUS_CODE).json({
                status: STATUS_CODE,
                pagination: {
                    total: founds.length,
                    offset: req.data.pagination.Offset,
                    limit: req.data.pagination.Limit,
                },
                data: founds,
            });
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
async function findByID(req, res) {
    const { id } = req.data.params;
    await transactionServices.find({ id }, req.data.pagination)
        .then((founds) => {
            const STATUS_CODE = 200;
            res.status(STATUS_CODE).json({
                status: STATUS_CODE,
                pagination: {
                    total: founds.length,
                    offset: req.data.pagination.Offset,
                    limit: req.data.pagination.Limit,
                },
                data: founds,
            });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function get(req, res) {

    try {
        await find(req, res);
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
