class Validate {
    static limit(value) {
        const MAX_LIMIT = 100;
        let valueNumber;

        if(typeof value === "string") {
            const Match = value.match(/[0-9]+/);

            if(Match === null) throw new Error("[ERR_FIELD_QUERY_INVALID] limit is invalid");
            valueNumber = Number(Match[0]);
        } else if(typeof value === "number"){
            valueNumber = value;
        } else throw new Error("[ERR_FIELD_QUERY_INVALID] limit is invalid");

        const IsValidated = 0 <= valueNumber && valueNumber <= MAX_LIMIT;

        if(IsValidated) return valueNumber;
        else throw new Error("[ERR_FIELD_QUERY_INVALID] limit exceeded");
    }

    static offset(value) {
        let valueNumber;

        if(typeof value === "string") {
            const Match = value.match(/[0-9]+/);
            if(Match === null) throw new Error("[ERR_FIELD_QUERY_INVALID] offset is invalid");
            valueNumber = Number(Match[0]);
        } else if(typeof value === "number"){
            valueNumber = value;
        } else throw new Error("[ERR_FIELD_QUERY_INVALID] limit is invalid");

        if(valueNumber >= 0) return valueNumber;
        else throw new Error("[ERR_FIELD_QUERY_INVALID] limit is invalid");
    }

    /**
     *
     * @param {string} value
     * @returns {object}
     */
    static date(value) {
        const match = value.match(/^(\w{4})-(\w{2})-(\w{2})$/);
        if(match === null)  throw new Error("[ERR_FIELD_QUERY_INVALID] date is invalid");
        const [ year, month, day ] = [ Number(match[1]), Number(match[2]), Number(match[3]) ];
        if(
            2_000 <= year && year <= 2_200 &&
            1 <= month && month <= 12 &&
            1 <= day && day <= 31
        ) {
            return { year, month, day };
        }
        else throw new Error("[ERR_FIELD_QUERY_INVALID] date is invalid");
    }

    static quantity(value) {
        const Match = value.match(/(\d+)\-(\d+)|(\d+)/);
        const IsValidated = Match !== null;

        if(!IsValidated) throw new Error("[ERR_FIELD_QUERY_INVALID] quantity is invalid");
        if(value === "") return value;
        if(Match[1] && Match[2]) {
            const [ Min, Max ] = [ Number(Match[1]), Number(Match[2]) ];
            if(Min < Max) return { Min, Max };
            else throw new Error("[ERR_FIELD_QUERY_INVALID] quantity is invalid");
        } else if(Match[3]) {
            const [ Min, Max ] = [ Number(Match[3]), Number(Match[3]) ];
            return { Min, Max }
        } else throw new Error("[ERR_FIELD_QUERY_INVALID] quantity stranger");
    }

    /**
     * @param {string} value
     * @returns {string|null}
     */
    static yesOrNot(value, field = "parameter on query") {
        if(value.match(/(si|no)/i) !== null) return value.toLowerCase();
        else throw new Error(`[ERR_FIELD_QUERY_INVALID] On ${field} parameter only "si" or "no" is valid`);
    }

    static genericLengthMax(value, field = "parameter on query", max = 200) {
        if(value.length > max){
            throw new Error(`${field} size exceeded (${max} characteres max.)`);
        }
        else return value.trim();
    }

    static VALIDATORS_PARAMS_FILTER = {
        // "limit": Validate.limit,
        // "offset": Validate.offset,
        /*[X]*/ "since": Validate.date,
        /*[X]*/ "until": Validate.date,
        /*[X]*/ "company_name": Validate.genericLengthMax,
        /*[X]*/ "line": Validate.genericLengthMax,
        /*[X]*/ "amba": Validate.yesOrNot,
        /*[X]*/ "transport_type": Validate.genericLengthMax,
        /*[X]*/ "jurisdiction": Validate.genericLengthMax,
        /*[X]*/ "province": Validate.genericLengthMax,
        /*[X]*/ "municipality": Validate.genericLengthMax,
        /*[X]*/ "quantity": Validate.quantity,
        /*[X]*/ "preliminary_data": Validate.yesOrNot
    };

    /**
     *
     * @param {import('express').Request} request
     * @returns {boolean}
     * @throws {Error} [ERR_FIELD_QUERY_INVALID] if the filter is invalid
     */
    static validateFilters(request, response, next) {

        const { limit: Limit, offset: Offset } = Validate.getLimitOffset(request);
        request.data = {};
        request.data.pagination = {
            Limit,
            Offset
        };

        const FiltersValid = Object.keys(Validate.VALIDATORS_PARAMS_FILTER);
        const FiltersOnQuery = Object.keys(request.query).map(f => f.toLowerCase())
            .filter(filter => FiltersValid.includes(filter));

        for(let i = 0; i < FiltersOnQuery.length; i++) {
            const filterOnQuery = FiltersOnQuery[i];
            try {
                const ValueValidated = Validate.VALIDATORS_PARAMS_FILTER[filterOnQuery](request.query[filterOnQuery], filterOnQuery)
                request.data.filters = { ...(request.data.filters), [filterOnQuery]: ValueValidated };

                if(request.data.filters.since && request.data.filters.until) {
                    const { since, until } = request.data.filters;
                    if(since.year > until.year) throw new Error("[ERR_FIELD_QUERY_INVALID] since date is greater than until date");
                    if(since.year === until.year && since.month > until.month) throw new Error("[ERR_FIELD_QUERY_INVALID] since date is greater than until date");
                    if(since.year === until.year && since.month === until.month && since.day > until.day) throw new Error("[ERR_FIELD_QUERY_INVALID] since date is greater than until date");
                }
            }
            catch(err) {
                if(err.message.includes("[ERR_FIELD_QUERY_INVALID]")) {
                    // Bad Request
                    response.status(400).json({ error: err.message });
                }
                else {
                    // Internal Server Error
                    throw new Error(err);
                }
                return;
            }
        }

        next();
    }

    static getLimitOffset(Request) {
        const
            LIMIT_DEFAULT = 50,
            OFFSET_DEFAULT = 0;
        let limit, offset;

        const Queries = Object.keys(Request.query);

        if(!( Queries.includes("limit") && Queries.includes("offset") )) {
            limit = Validate.limit(LIMIT_DEFAULT);
            offset = Validate.offset(OFFSET_DEFAULT);
        }
        else {
            limit = Validate.limit(Request.query.limit);
            offset = Validate.offset(Request.query.offset);
        }

        return { limit, offset };
    }

    static validateID(request, response, next) {
        const { id } = request.params;
        const IsValidated = id.match(/^[0-9]+$/) !== null;

        request.data = {};
        request.data.pagination = {
            Limit: 1,
            Offset: 0
        };
        if(IsValidated && Number(id) > 0) {
            request.data.params = {};
            request.data.params.id = Number(id);
            next();
        }
        else {
            // Bad Request
            response.status(400).json({ error: "[ERR_FIELD_QUERY_INVALID] id is invalid" });
        }
    }
}

module.exports = { validateFilters: Validate.validateFilters, validateID: Validate.validateID };
