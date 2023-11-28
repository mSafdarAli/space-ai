import { ObjectId } from 'mongodb';
import {  Filter_Options, Request, Response } from '../../__types';
import { BaseController } from '../../core';
import { collections } from '../../database/db';

export default class PropertyController extends BaseController {
    public __component: string = "properties";

    private filter_options: Filter_Options = {
        search: [],
        defaultSort: "_id",
        filters: {},
    };
    
    public get = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            let result;
            result = await collections.properties?.findOne({ _id: new ObjectId(id) }, { projection: { website:1, details: 1 } })
            return this.json(res, 200, result);
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }
    
    public list = async (req: Request, res: Response): Promise<Response> => {
        try {
            this.getAggrigation(req, this.filter_options, {
                scrap_done:true
            });
            let [result, pagination] = await Promise.all([
                collections.properties
                    ?.aggregate([
                        ...req.aggregations,
                        {
                            $project: {
                                _id: 1,
                                scrap_done: 1,
                                title: "$details.title",
                                image: { $arrayElemAt: ["$details.images", 1] },
                                excerpt: 1,
                                website:1
                            },
                        },
                    ])
                    .toArray(),
                collections.properties?.aggregate(req.dbPagination).toArray(),
            ]);
            return this.json(res, 200, { data: result, pagination: pagination });
        } catch (error) {
            return this.jsonError(res, 500, this.__component, "wrong", error);
        }
    }
}