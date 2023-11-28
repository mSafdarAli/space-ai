import config from '../config/config';
import { BaseController } from './';
import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request, Filter_Options } from '../__types';
// import { User } from '../models';
import { ObjectId } from 'mongodb';
import { User } from '../models';

export class MiddleWare extends BaseController {
	
	public crosHeaders = (req: Request, res: Response, next: NextFunction) => {
		// Website you wish to allow to connect
		const origin = req.headers.origin;
		if (typeof origin == 'string') {
			if (config.allowedDomains.indexOf(origin) > -1) {
				res.setHeader('Access-Control-Allow-Origin', origin);
			}
			
			// Request methods you wish to allow
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			
			// Request headers you wish to allow
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization, Authorization');
			
			// Set to true if you need the website to include cookies in the requests sent
			// to the API (e.g. in case you use sessions)
			res.setHeader('Access-Control-Allow-Credentials', "true");
			
			// Pass to next layer of middleware
		}
		next();
	}
	// public setFiltersAndSorting = (search: string[]) => {
	// 	return async (req: Request, res: Response, next: NextFunction) => {
	// 		try {
	// 			const data: {} = {};
	// 			Object.keys(req.query).forEach(field => {
	// 				let [column, operator] = field.split("__");
	// 				if (operator) {
	// 					if (operator === "eq") {
	// 						if(req.query[field] == "true" || req.query[field] == "false") {
	// 							data[column] = Boolean(req.query[field]);
	// 						} else {
	// 							data[column] = req.query[field];
	// 						}
	// 					} else {
	// 						if (!data[column]) {
	// 							data[column] = {};
	// 						}
	// 						data[column][operator] = req.query[field];
	// 					}
	// 				}
	// 			});
	// 			if (req.user && req.user.role?.name.indexOf("Admin") === -1) {
	// 				data["created_by"] = new ObjectId(req.user._id);
	// 			}
	// 			if (req.query["q"]) {
	// 				const q = req.query["q"].toString();
	// 				if (search.length > 0) {
	// 					const se = search.map(e => {
	// 						const se = {};
	// 						se[e] = new RegExp(q);
	// 						return se;
	// 					});
	// 					data["$or"] = se;
	// 				}
	// 			}
	// 			req.dbFilters = data;
	// 			let rawParm;
	// 			if (req.query['orderby']) {
	// 				rawParm = req.query['orderby'];
	// 			} else {
	// 				rawParm = '_id';
	// 			}
	
	// 			let order = 1;
	// 			if (req.query['orderdir']) {
	// 				order = parseInt(req.query['orderdir'].toString());
	// 			}
	// 			let sort = {};
	// 			sort[rawParm] = order;
	// 			req.dbSort = sort;
	
	// 			// Pagination
	// 			let page = 1;
	// 			let page_size = global['config'].pagination.page_size;
	// 			if (req.query['page']) {
	// 				page = parseInt(req.query['page'].toString());
	// 			}
	// 			if (req.query['page_size']) {
	// 				page_size = parseInt(req.query['page_size'].toString());
	// 			}
	// 			if (page) {
	// 				page = page - 1;
	// 			}
	
	// 			if (page_size > global['config'].pagination.maxLimit) {
	// 				page_size = global['config'].pagination.maxLimit;
	// 			}
	// 			const skip = page * page_size;
	// 			req.dbPagination = {
	// 				pagination: [{ $count: "total" }, { $addFields: { page: page + 1, page_size: page_size }}],
	// 				data: [{ $skip: skip }, { $limit: page_size }] // add projection here wish you re-shape the docs
	// 			};
	// 			next();
	// 		} catch (error) {
	// 			next(error);
	// 		}
	// 	}
	// }
	public setFiltersAndSorting = (search: string[], filter_options: Filter_Options, defaultSort) => {
		return async (req: Request, res: Response, next: NextFunction) => {
			try {
				const data: {} = {};
				req.aggregations = [];
				req.dbPagination = [];
				Object.keys(req.query).forEach(field => {
					if(filter_options[field]) {
						const {type, filter} = filter_options[field];
						let value: any = req.query[field];
						if(type == "boolean") {
							value = JSON.parse(value.toLowerCase());;
						}
						if(filter === "$in") {
							value = value.split(",");
							if(type === "int") {
								value = value.map((str) => {return parseInt(str); });
							}
						} else if (type === "int") {
							value = parseInt(value);
						}
						
						if (filter === "eq") {
							data[field] = value;
						} else {
							if (!data[field]) {
								data[field] = {};
							}
							data[field][filter] = value;
						}
					}
				});
				if (req.user && req.user.role?.name.indexOf("Admin") === -1) {
					data["created_by"] = new ObjectId(req.user._id);
				}
				if (req.query["q"]) {
					const q = req.query["q"].toString();
					if (search.length > 0) {
						const se = search.map(e => {
							const se = {};
							se[e] = new RegExp(q);
							return se;
						});
						data["$or"] = se;
					}
				}
				req.dbPagination.push({
					$match: data,
				});
				req.aggregations.push({
					$match: data,
				});
				
				
				let rawParm;
				if (req.query['orderby']) {
					rawParm = req.query['orderby'];
				} else {
					rawParm = defaultSort;
				}
				
				let order = 1;
				if (req.query['orderdir']) {
					order = parseInt(req.query['orderdir'].toString());
				}
				let sort = {};
				sort[rawParm] = order;
				req.aggregations.push({
					$sort: sort,
				});
				
				
				// Pagination
				let page = 1;
				let page_size = global['config'].pagination.page_size;
				if (req.query['page']) {
					page = parseInt(req.query['page'].toString());
				}
				if (req.query['limit']) {
					page_size = parseInt(req.query['limit'].toString());
				}
				if (page) {
					page = page - 1;
				}
				
				if (page_size > global['config'].pagination.maxLimit) {
					page_size = global['config'].pagination.maxLimit;
				}
				const skip = page * page_size;

				// Pagination
				req.aggregations.push({ $skip: skip }, { $limit: page_size });
				req.dbPagination.push({
					$facet: {
						pagination: [{ $count: "total" }, { $addFields: { page: page + 1, page_size: page_size }}],
					}
				});
				next();
			} catch (error) {
				next(error);
			}
		}
	}
	
	public TokenValidator = (req: Request, res: Response, next: NextFunction) => {
		const token = this.getToken(req);
		if (req.method === 'OPTIONS') {
			res.sendStatus(200);
			return;
		}
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, config.secret, (err, decoded: User) => {
				if (err) {
					return res.status(401).json(this.error('auth', 'token'));
				}
				req.user = decoded;
				next();
			});
		} else {
			// if there is no token
			// return an error
			return res.status(401).json(this.error('auth', 'login'));
		}
	}
	
	private getToken = (req: Request): string | null => {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		}
		return null;
	}
	
	// Example
	// { path: controller.__component + '/', method: "get", function: controller.list, private: true, perm_component: 'comments', permission: 'view all' },
	public permission = (component: string, permission: string) => {
		return async (req, res, next) => {
			try {
				if (req.user) {
					if (req.user.access[component] && req.user.access[component][permission] === true) {
						next();
					} else {
						return res.status(401).json(this.error('auth', 'permission'));
					}
				} else {
					return res.status(401).json(this.error('auth', 'login'));
				}
			} catch (error) {
				next(error);
			}
		}
	}
}