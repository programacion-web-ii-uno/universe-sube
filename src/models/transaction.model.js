const fs = require("fs");
const parser = require('stream-json');
const streamArray = require('stream-json/streamers/StreamArray');

const PATH_DB = "D:\\uno\\materias\\PWII\\universe-sube\\database\\cantidad-de-transacciones-sube-por-dia-en-2024.json";

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


// Ejemplo de registro de un objeto del JSON en el archivo
// {
//     "DIA_TRANSPORTE":"2024-01-01",
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
 * @param {string} Filters.amba
 * @param {string} Filters.transport_type
 * @param {string} Filters.jurisdiction
 * @param {string} Filters.province
 * @param {string} Filters.municipality
 * @param {number} Filters.quantity
 * @param {string} Filters.preliminary_data
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

        jsonStream.on('data', ({ value: Value }) => {
            const matchesFilters = (Filters, Value) => {
                if (Filters.since) {
                    const sinceDate = new Date(Filters.since.year, Filters.since.month - 1, Filters.since.day);
                    const recordDate = new Date(Value.DIA_TRANSPORTE);
                    if (recordDate < sinceDate) return false;
                }
                if (Filters.until) {
                    const untilDate = new Date(Filters.until.year, Filters.until.month - 1, Filters.until.day);
                    const recordDate = new Date(Value.DIA_TRANSPORTE);
                    if (recordDate > untilDate) return false;
                }
                if (Filters.company_name && Value.NOMBRE_EMPRESA !== Filters.company_name) return false;
                if (Filters.line && Value.LINEA !== Filters.line) return false;
                if (Filters.amba && Value.AMBA !== Filters.amba) return false;
                if (Filters.transport_type && Value.TIPO_TRANSPORTE !== Filters.transport_type) return false;
                if (Filters.jurisdiction && Value.JURISDICCION !== Filters.jurisdiction) return false;
                if (Filters.province && Value.PROVINCIA !== Filters.province) return false;
                if (Filters.municipality && Value.MUNICIPIO !== Filters.municipality) return false;
                if (Filters.quantity && Value.CANTIDAD !== Filters.quantity) return false;
                if (Filters.preliminary_data && Value.DATO_PRELIMINAR !== Filters.preliminary_data) return false;
                return true;
            };

            if (matchesFilters(Filters, Value) && currentIndex >= Offset && results.length < Limit) {
                results.push(Value);
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
            console.log('Objetos paginados:', results);
            res(results);
        });

        jsonStream.on('error', (err) => {
            console.error(`Ocurrio un error leyendo el JSON ${PATH_DB}:${currentIndex}`)
            rej(err);
        });
    })
}

module.exports = { getAll, find }
