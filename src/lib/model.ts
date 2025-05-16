import mongoose from "mongoose";

class ModelClass {
    constructor() { }

    returnText = (value: String) => {
        switch (value) {
            // case "phone.national_number":
            //     return "Mobile number";
            // case "phone.country_code":
            //     return "Country code";
            case "otp":
                return "OTP";
            default:
                return (value.charAt(0).toUpperCase() + value.slice(1)).replace("_", " ");
        }
    }

    /**
         * Return the total coun
         * @param schemaModel 
         * @param filterQuery 
         * @returns 
    */
    countDocuments = async (schemaModel: any, filterQuery: any) => {
        try {
            let result = await schemaModel.countDocuments(filterQuery,)
            if (result) return result
            return null
        }
        catch (err) {
            return null;
        }
    }


    /**
        * Normal pagination
        * @param schemaModel Model to use in pagination 
        * @param query query things
        * @param projection to project the model
        * @param options 
        * @returns 
    */

    find = async <T>(schemaModel: any, query: any, projection: any, options: mongoose.QueryOptions<T> = {}) => {
        let { page, limit } = query;
        page = Number(page) || 0;
        limit = Number(limit) || 10;
        const skipLimit = (page > 1 ? page - 1 : 0) * limit;
        delete query.page
        delete query.limit


        let result = await schemaModel.find(query, projection, {
            ...options,
            skip: skipLimit,
            limit: limit,
            // sort: options,
        })
        const total = await this.countDocuments(schemaModel, query);

        return {
            data: result ?? [],
            total: total ?? 0,
        };
    }

    /**
        
        * @param schemaModel Model to use in pagination 
        * @param aggregationQuery query things
        * @param projection to project the model
        * @param pageLimit pagination
        * @param sort sort the doc 
        * @returns 
    */
    aggregate = async (schemaModel: any, aggregationQuery: Object[], projection: any, pageLimit: any, sort: any = {}) => {
        let { page, limit } = pageLimit;
        // page = Number(page) || 0;
        // limit = Number(limit) || 10;
        const skipLimit = (page > 1 ? page - 1 : 0) * limit;
        sort = Object.keys(sort).length === 0 ? { _id: -1 } : sort;
        projection = Object.keys(projection).length === 0 ? { _v: 0 } : projection;

        let pipelines = [
            ...aggregationQuery,
            { $project: projection },
            { $sort: sort },
            {
                $facet: {
                    data: [{ $skip: skipLimit }, { $limit: limit }],
                    count: [{ $count: "total" }]
                },
            },
        ];

        const result = await schemaModel.aggregate(pipelines, {
            collation: {
                locale: "en",
                numericOrdering: true
            }
        });

        return {
            data: result?.[0]?.data ?? [],
            total: result?.[0]?.count?.[0]?.total ?? 0,
        };
    }


    /**
       
       * @param schemaModel Model to use in pagination 
       * @param aggregationQuery query things
       * @param projection to project the model
       * @param sort sort the doc 
       * @returns 
   */
    aggregatee = async <T>(schemaModel: any, aggregationQuery: Object[], projection: any = {}, sort: mongoose.QueryOptions<T> = {}) => {
        projection = Object.keys(projection).length === 0 ? { _v: 0 } : projection;
        sort = Object.keys(sort).length === 0 ? { _id: -1 } : sort;

        let pipelines = [
            ...aggregationQuery,
            { $sort: sort },
            { $project: projection },
        ];

        return await schemaModel.aggregate(pipelines, {
            collation: {
                locale: "en"
            }
        });


    }

    findAll = async <T>(schemaModel: any, query: any, projection: any, options: mongoose.QueryOptions<T> = {}) => {

        return await schemaModel.find(query, projection, {
            ...options,
        })
    }

    findOneAndUpdate = async (schemaModel: any, query: any, data: any) => {
        return await schemaModel.findOneAndUpdate(query, { $set: data }, { new: true })
    }

    findOne = async (schemaModel: any, query: any, projection: any = {}) => {
        return await schemaModel.findOne(query, projection)
    }



}
export const Model = new ModelClass();


