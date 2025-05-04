/**
 * Se encarga de la logica de negocio, puede llamar a otros servicios y a varios modelos
 */

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

const transactionModel = require("../models/transaction.model.js");

/**
 *
 * @param {number} Limit Pagination Param
 * @param {number} Offset Pagination Param
 */
async function getAll(Limit, Offset) {
    try {
        return await transactionModel.getAll(Limit, Offset);
    } catch (err) {
        console.error(err);
    }
}

module.exports = { getAll };
