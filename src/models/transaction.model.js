const fs = require("fs");
const parser = require('stream-json');
const streamArray = require('stream-json/streamers/StreamArray');

const PATH_DB = "D:\\uno\\materias\\PWII\\universe-sube\\database\\cantidad-de-transacciones-sube-por-dia-en-2024.json";

/*
async function getAll({ Limit, Offset }) {
    let currentIndex = 0;
    let results = [];

    return new Promise( (res, rej) => {
        const jsonStream = fs.createReadStream(PATH_DB)
            .pipe(parser())
            .pipe(new streamArray());

        // El evento se dispara por cada registro del JSON ya parseado
        jsonStream.on('data', ({ value }) => {
            if (currentIndex >= Offset && results.length < Limit) {
                results.push(value);
            }
            currentIndex++;

            if (results.length === Limit) {
                jsonStream.pause();
                res(results);
            }
        });

        jsonStream.on('end', () => {
            if (results.length < Limit) { // por si es menor que el limit
                res(results);
            }
            // console.log('Objetos paginados:', results);
            res(results);
        });

        jsonStream.on('error', (err) => {
            console.error(`Ocurrio un error leyendo el JSON ${PATH_DB}:${currentIndex}`)
            rej(err);
        });
    })
}
*/


// Ejemplo de registro de un objeto del JSON en el archivo
// {
//     "DIA_TRANSPORTE":"2024-12-31",
//     "NOMBRE_EMPRESA":"AUTOTRANSPORTE CEFERINO S.R.L",
//     "LINEA":"LINEA_3",
//     "AMBA":"NO",
//     "TIPO_TRANSPORTE":"COLECTIVO",
//     "JURISDICCION":"MUNICIPAL",
//     "PROVINCIA":"CHUBUT",
//     "MUNICIPIO":"RAWSON",
//     "CANTIDAD":"111",
//     "DATO_PRELIMINAR":"NO"
// }

function fixValue(transaction) {
    // Transform the transaction
    if(transaction.CANTIDAD)
        transaction.CANTIDAD = Number(transaction.CANTIDAD);
    if(transaction.id)
        transaction.id = Number(transaction.id);
}

/**
 *
 * @param {object} Filters
 * @param {object} Filters.since Date filter
 * @param {number} Filters.since.year Date filter
 * @param {number} Filters.since.month Date filter
 * @param {number} Filters.since.day Date filter
 * @param {object} Filters.until Date filter
 * @param {number} Filters.until.year Date filter
 * @param {number} Filters.until.month Date filter
 * @param {number} Filters.until.day Date filter
 * @param {string} Filters.company_name Company name filter
 * @param {string} Filters.line
 * @param {boolean} Filters.amba
 * @param {string} Filters.transport_type
 * @param {string} Filters.jurisdiction
 * @param {string} Filters.province
 * @param {string} Filters.municipality
 * @param {object} Filters.quantity
 * @param {number} Filters.quantity.Min
 * @param {number} Filters.quantity.Max
 * @param {boolean} Filters.preliminary_data
 * @param {object} param1
 * @param {number} param1.Limit Pagination Param
 * @param {number} param1.Offset Pagination Param
 * @returns
 */
async function find(Filters, { Limit, Offset }) {
    let currentIndex = 0;
    let results = [];

    return new Promise( (res, rej) => {
        const jsonStream = fs.createReadStream(PATH_DB)
            .pipe(parser())
            .pipe(new streamArray());

        jsonStream.on('data', ({ value: transaction }) => {

            fixValue(transaction);

            const matchesFilters = (Filters, Transaction) => {

                if(Filters.id) {
                    return Transaction.id === Filters.id;
                }
                else {
                    if (Filters.since) {
                        const sinceDate = new Date(Filters.since.year, Filters.since.month - 1, Filters.since.day);
                        const recordDate = new Date(Transaction.DIA_TRANSPORTE);
                        if (recordDate < sinceDate) return false;
                    }
                    if (Filters.until) {
                        const untilDate = new Date(Filters.until.year, Filters.until.month - 1, Filters.until.day);
                        const recordDate = new Date(Transaction.DIA_TRANSPORTE);
                        if (recordDate > untilDate) return false;
                    }
                    if (Filters.company_name && Transaction.NOMBRE_EMPRESA !== Filters.company_name.toUpperCase()) return false;
                    if (Filters.line && Transaction.LINEA !== Filters.line.toUpperCase()) return false;
                    if (Filters.amba && Transaction.AMBA !== Filters.amba.toUpperCase()) return false;
                    if (Filters.transport_type && Transaction.TIPO_TRANSPORTE !== Filters.transport_type.toUpperCase()) return false;
                    if (Filters.jurisdiction && Transaction.JURISDICCION !== Filters.jurisdiction.toUpperCase()) return false;
                    if (Filters.province && Transaction.PROVINCIA !== Filters.province.toUpperCase()) return false;
                    if (Filters.municipality && Transaction.MUNICIPIO !== Filters.municipality.toUpperCase()) return false;
                    if (Filters.quantity && (Transaction.CANTIDAD < Filters.quantity.Min || Filters.quantity.Max < Transaction.CANTIDAD)) return false;
                    if (Filters.preliminary_data && Transaction.DATO_PRELIMINAR !== Filters.preliminary_data.toUpperCase()) return false;

                    return true;
                }
            };

            if (matchesFilters(Filters, transaction) && currentIndex >= Offset && results.length < Limit) {
                results.push(transaction);
            }
            currentIndex++;

            if (results.length === Limit) {
                jsonStream.pause();
                res(results);
            }
        });

        jsonStream.on('end', () => {
            if (results.length < Limit) { // por si es menor que el limit
                res(results);
            }
            res(results);
        });

        jsonStream.on('error', (err) => {
            console.error(`Ocurrio un error leyendo el JSON ${PATH_DB}:${currentIndex}`)
            rej(err);
        });
    })
}


/**
 * Agrega un registro al archivo JSON
 * @param {object} Transaction
 * @param {string} Transaction.DIA_TRANSPORTE
 * @param {string} Transaction.NOMBRE_EMPRESA
 * @param {string} Transaction.LINEA
 * @param {string} Transaction.AMBA
 * @param {string} Transaction.TIPO_TRANSPORTE
 * @param {string} Transaction.JURISDICCION
 * @param {string} Transaction.PROVINCIA
 * @param {string} Transaction.MUNICIPIO
 * @param {number} Transaction.CANTIDAD
 * @param {string} Transaction.DATO_PRELIMINAR
 * @returns
*/
async function add(Transaction) {
    const transactions = JSON.parse(fs.readFileSync(PATH_DB, 'utf8'));
    transactions.push(Transaction);

    fs.writeFileSync(PATH_DB, JSON.stringify(transactions, null, 2), 'utf8');

    return new Promise( (res, rej) => {
        const jsonStream = fs.createReadStream(PATH_DB) // deberia ser un stream de escritura
            .pipe(parser())
            .pipe(new streamArray());

        jsonStream.on('data', ({ value: transaction }) => {

            fixValue(transaction);

            if (matchesFilters(Filters, transaction) && currentIndex >= Offset && results.length < Limit) {
                results.push(transaction);
            }
            currentIndex++;

            if (results.length === Limit) {
                jsonStream.pause();
                res(results);
            }
        });

        jsonStream.on('end', () => {
            if (results.length < Limit) { // por si es menor que el limit
                res(results);
            }
            res(results);
        });

        jsonStream.on('error', (err) => {
            console.error(`Ocurrio un error leyendo el JSON ${PATH_DB}:${currentIndex}`)
            rej(err);
        });
    })
}

module.exports = { /* getAll, */ find, add }
