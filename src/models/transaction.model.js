const fs = require("fs").promises;
const path = require("path");

const PATH_DB = path.join(__dirname, "../../database/cantidad-de-transacciones-sube-por-dia-en-2024.json");


// Carga el archivo completo como JSON
async function loadData() {
    const data = await fs.readFile(PATH_DB, "utf8");
    return JSON.parse(data);
}

// Guarda el array de objetos actualizado
async function saveData(data) {
    await fs.writeFile(PATH_DB, JSON.stringify(data, null, 2), "utf8");
}

// Filtra según los parámetros recibidos
async function find(filters = {}, { Limit = 10, Offset = 0 } = {}) {
    const data = await loadData();
    let filtered = data;

    for (const key in filters) {
        filtered = filtered.filter(item => item[key] == filters[key]);
    }

    return filtered.slice(Offset, Offset + Limit);
}

// Agrega una nueva transacción
async function add(transaction) {
    const data = await loadData();
    const newId = data.length > 0 ? Math.max(...data.map(d => Number(d.id))) + 1 : 1;
    const newTransaction = { id: newId, ...transaction };
    data.push(newTransaction);
    await saveData(data);
    return newTransaction;
}

// Actualiza una transacción por id
async function update(id, updatedTransaction) {
    const data = await loadData();
    const index = data.findIndex(t => String(t.id) === String(id));
    if (index === -1) throw new Error("Transaction not found");

    data[index] = { ...data[index], ...updatedTransaction };
    await saveData(data);
    return data[index];
}

// Borra una transacción por id
async function _delete(id) {
    const data = await loadData();
    const index = data.findIndex(t => String(t.id) === String(id));
    if (index === -1) throw new Error("Transaction not found");

    data.splice(index, 1);
    await saveData(data);
    return true;
}

module.exports = { find, add, update, delete: _delete };
