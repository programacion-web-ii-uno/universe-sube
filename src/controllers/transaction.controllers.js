const transactionServices = require("../services/transaction.services.js");

/**
 * Busca transacciones según filtros y paginación.
 */
async function find(req, res) {
    const Filters = req.data.filters ?? {};
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
 * Busca una transacción por ID.
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
 * Controlador general para buscar con filtros.
 */
async function get(req, res) {
    try {
        await find(req, res);
    } catch (error) {
        if (error.message.includes("[ERR_FIELD_QUERY_INVALID]")) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

/**
 * Actualiza parcialmente una transacción.
 */
async function modificate(req, res) {
    const { id } = req.data.params;
    const transaction = req.body;
    await transactionServices.find({ id }, req.data.pagination)
        .then((founds) => {
            if (founds.length === 0) {
                res.status(404).json({ error: "Transaction not found" });
            } else {
                const updatedTransaction = { ...founds[0], ...transaction };
                transactionServices.update(id, updatedTransaction)
                    .then(() => {
                        res.status(200).json({ message: "Transaction updated successfully", data: updatedTransaction });
                    })
                    .catch((error) => {
                        res.status(500).json({ error: error.message });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}

/**
 * Agrega una nueva transacción.
 */
async function add(req, res) {
    const transaction = req.body;
    await transactionServices.add(transaction)
        .then(() => {
            res.status(201).json({ message: "Transaction added successfully" });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
}

/**
 * Actualiza una transacción por ID.
 */
async function update(req, res) {
    const { id } = req.data.params;
    const transactionData = req.body;

    try {
        const [existing] = await transactionServices.find({ id }, req.data.pagination);
        if (!existing) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const updatedTransaction = { ...existing, ...transactionData };
        await transactionServices.update(id, updatedTransaction);

        res.status(200).json({ message: "Transaction updated successfully", data: updatedTransaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Elimina una transacción por ID.
 */
async function _delete(req, res) {
    const { id } = req.data.params;

    try {
        const [existing] = await transactionServices.find({ id }, req.data.pagination);
        if (!existing) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        await transactionServices.delete(id);
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { get, findByID, modificate, update, delete: _delete, add };
