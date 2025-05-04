/**
 * Se encarga de ela logica de peticiones HTTP, errores 400, status code, etc.
 * Usa los servicios
 */

const transactionServices = require("../services/transaction.services.js");

class Validate {
    MAX_LIMIT = 100;

    limit(value){
        const Match = value.match(/[0-9]{3}/);

        if(Match === null) return false;

        const ValueNumber = Number(Match[0]);

        return 0 <= ValueNumber && ValueNumber <= MAX_LIMIT;
    }

    offset(value){
        const Match = value.match(/[0-9]{3}/);

        if(Match === null) return false;

        const ValueNumber = Number(Match[0]);

        return 0 <= ValueNumber;
    }

    date(value) {
        const match = value.match(/^(\w{4})-(\w{2})-(\w{2})$/);
        if(match === null) return false;
        return { year: match[1], month: match[2], day: match[3] };
    }

    validatorsParams = [
        { "limit": limitAndOffset },
        { "since": date },
        { "until": date },
        { "companyName": () => true },
        { "line": () => true },
        { "amba": value => value.match(/(true|false)/) !== null },
        { "transportType": () => true },
        { "Jurisdiction": () => true },
        { "Province": () => true },
        { "Municipality": () => true },
        { "Quantity": () => true },
        { "PreliminaryDat": () => true }
    ];
}

/**
 * @param {import('express').Request} req
 */
function getLimitOffset(req) {
    const
        LIMIT_DEFAULT = 50,
        OFFSET_DEFAULT = 0;
    let limit, offset;

    const Queries = Object.keys(req.query);
    if(!( Queries.includes("limit") && Queries.includes("offset") )) {
        limit = LIMIT_DEFAULT;
        offset = OFFSET_DEFAULT;
    }
    else {
        limit = req.query.limit;
        offset = req.query.offset;
    }

    return { limit, offset };
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function get(req, res) {
    const { limit: Limit, offset: Offset } = getLimitOffset(req);

    try {
        const transactions = await transactionServices.getAll(Limit, Offset);
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    /* const Queries = Object.keys(req.query);

    {
        TransportDay,
        CompanyName,
        Line,
        Amba,
        TransportType,
        Jurisdiction,
        Province,
        Municipality,
        Quantity,
        PreliminaryData
    }

    const HasFilters = SearchParameters.some(
        (e) => e.normalize("NFKD").trim() !== ""
    );

    if (HasFilters) {
        transactionController.find(params);
    } else {
        transactionController.getAlltransactions();
    } */
}

module.exports = { get }
