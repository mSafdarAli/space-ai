import { ObjectId } from 'mongodb';
import { Filter_Options, Request, Response } from '../../__types';
import { BaseController } from '../../core';
import { collections } from '../../database/db';

export default class UserController extends BaseController {
	public __component: string = "users";

	private filter_options: Filter_Options = {
		search: [],
		defaultSort: "_id",
		filters: {},
	};

	public get = async (req: Request, res: Response): Promise<Response> => {
		try {
			const { id } = req.params;
			let result;
			result = await collections.users?.findOne({ _id: new ObjectId(id) })
			return this.json(res, 200, result);
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}


	public list = async (req: Request, res: Response): Promise<Response> => {
		try {
			this.getAggrigation(req, this.filter_options, {});
			let [result, pagination] = await Promise.all([
				collections.users
					?.aggregate([
						...req.aggregations,
						{
							$lookup: {
								from: "roles",
								localField: "roleId",
								foreignField: "_id",
								as: "roledata",
							},
						},
						{
							$project: {
								_id: 1,
								name: 1,
								email: 1,
								isProfileCompleted: 1,
								roleId:1,
								role: { $arrayElemAt: ["$roledata", 0] }
							},
						},
					])
					.toArray(),
				collections.users?.aggregate(req.dbPagination).toArray(),
			]);
			return this.json(res, 200, { data: result, pagination: pagination });
		} catch (error) {
			return this.jsonError(res, 500, this.__component, "wrong", error);
		}
	}

	public changePassword = async (req: Request, res: Response): Promise<Response> => {
		const FormBody: { email: string, oldPassword: string, newPassword: string } = req.body;
		const user = await collections.users?.findOne({ email: FormBody.email });
		if (user) {
			const checkPassword = this.passwordEn(FormBody.oldPassword, user.salt);

			if (checkPassword.password === user.password) {
				const nePassword = this.passwordEn(FormBody.newPassword);

				await collections.users?.updateOne({ _id: user._id }, { $set: nePassword });
			}
		}
		return this.json(res, 200, null, "Password Changed successfully");

	}
}