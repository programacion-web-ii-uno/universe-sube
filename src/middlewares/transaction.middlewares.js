class Validate {
    static limit(value) {
        const MAX_LIMIT = 100;
        let valueNumber;

        if(typeof value === "string") {
            const Match = value.match(/[0-9]+|^$/);

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
            const Match = value.match(/[0-9]+|^$/);
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
        const match = value.match(/^(\w{4})-(\w{2})-(\w{2})$|^$/);
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
        const Match = value.match(/(\d+)\-(\d+)|(\d+)|^$/);
        const IsValidated = Match !== null;

        if(!IsValidated) throw new Error("[ERR_FIELD_QUERY_INVALID] quantity is invalid");
        if(value === "") return value;
        if(Match[1] && Match[2]) {
            if(min < max) return { min: Match[1], max: Match[2] }
            else throw new Error("[ERR_FIELD_QUERY_INVALID] quantity is invalid");
        } else if(Match[3]) {
            return { min: Match[3], max: Match[3] }
        } else throw new Error("[ERR_FIELD_QUERY_INVALID] quantity stranger");
    }

    static yesOrNot(value) {
        return value.match(/(yes|no)/i) !== null;
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
        "since": Validate.date,
        "until": Validate.date,
        "company_name": Validate.genericLengthMax,
        "line": Validate.genericLengthMax,
        "amba": Validate.yesOrNot,
        "transport_type": Validate.genericLengthMax,
        "jurisdiction": Validate.genericLengthMax,
        "province": Validate.genericLengthMax,
        "municipality": Validate.genericLengthMax,
        "quantity": Validate.quantity,
        "preliminary_data": Validate.yesOrNot
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
        const FiltersOnQuery = Object.keys(request.query)
            .filter(filter => FiltersValid.includes(filter.toLowerCase()));

        for(let i = 0; i < FiltersOnQuery.length; i++) {
            const filterOnQuery = FiltersOnQuery[i];
            try {
                const ValueValidated = Validate.VALIDATORS_PARAMS_FILTER[filterOnQuery](request.query[filterOnQuery], filterOnQuery)
                request.data.filters = { ...(request.data.filters), [filterOnQuery]: ValueValidated };
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
}

module.exports = { validateFilters: Validate.validateFilters };
