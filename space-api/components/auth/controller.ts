import { NextFunction, Request, Response } from '../../__types';
import { BaseController } from '../../core';
import { collections } from '../../database/db';
// import { EmailHelper } from '../../helpers/email';
import UserHelper from '../../helpers/user';
// import axios from 'axios';
// import { EmailHelper } from '../../helpers/email';


export default class AuthController extends BaseController {

	public __component: string = "auth";
	public login = async (req: Request, res: Response): Promise<Response> => {
		const FormBody: { email: string, password: string } = req.body;
		const user = await collections.users?.findOne({ email: FormBody.email });
		if (user) {
			const password = this.passwordEn(FormBody.password, user.salt);
			if (password.password === user.password) {
				const token = await UserHelper.updateToken(user._id);
				return this.json(res, 200, null, "Login Successfully", token);
			} else {
				return this.jsonError(res, 400, this.__component, 'Login information is wrong');
			}
		}
		return this.jsonError(res, 400, this.__component, "Login information is wrong");
	}

	// public register = async (req: Request, res: Response): Promise<Response> => {
	// 	try {
	// 		const Validationrules = {
	// 			name: global['config'].commonRules.name,
	// 			password: global['config'].commonRules.password.push('confirmed'),
	// 			email: global['config'].commonRules.email,
	// 			account_type: global['config'].commonRules.name,
	// 		}
	// 		const formErrors = await this.validateForm(req.body, Validationrules);
	// 		const FormBody = this.getFormFields(req.body, Validationrules);
	// 		if (!formErrors) {
	// 			const password = this.passwordEn(FormBody.password);
	// 			const role = await collections.roles?.findOne({ name: FormBody.account_type });
	// 			if (role) {
	// 				FormBody["roleId"] = role._id;
	// 			}
	// 			FormBody.isProfileCompleted = false;
	// 			await collections.users?.insertOne({ ...FormBody, ...password });
	// 			return this.json(res, 200, null, "Registered Successfully");
	// 		} else {
	// 			return this.jsonError(res, 400, this.__component, formErrors);
	// 		}
	// 	} catch (error) {
	// 		return this.jsonError(res, 400, this.__component, "wrong", error);
	// 	}
	// }

	public forgetPassword = async (req: Request, res: Response): Promise<Response> => {
		const FormBody: { email: string } = req.body;
		const user = await collections.users?.findOne({ email: FormBody.email });
		// const fields: string[] = []
		// let email_body: string = "";
		if (user) {
			const otpCode = Math.floor(1000 + Math.random() * 9000);
			await collections.users?.updateOne({}, { $set: { otp: otpCode } })
			// const template = await collections.emailTemplates?.findOne({ used_for: 'send_otp', active: true })
			// template?.fields.forEach(el => {
			// 	fields.push(el.code);
			// });
			// email_body = this.replaceEmailBody(template?.message, fields, [user.name, otpCode])
			// const mailOptions = {
			// 	to: FormBody.email,
			// 	subject: template?.subject,
			// 	text: email_body
			// };
			// const email = new EmailHelper();
			// await email.sendEmail(mailOptions);
			return this.json(res, 200, { link: "reset-password" }, "check");
		}
		return this.jsonError(res, 400, this.__component, " incorrect");
	}

	public verifyOTP = async (req: Request, res: Response): Promise<Response> => {
		const FormBody: { email: string, otp: number } = req.body;
		const user = await collections.users?.findOne({ email: FormBody.email });
		if (user) {
			if (user.otp == FormBody.otp) {
				return this.json(res, 200, null, "true");
			} else {
				return this.jsonError(res, 400, this.__component, "Code is incorrect");
			}
		}
		return this.jsonError(res, 400, this.__component, "Email is incorrect");
	}

	public resetPassword = async (req: Request, res: Response): Promise<Response> => {
		const FormBody: { email: string, password: string } = req.body;
		const user = await collections.users?.findOne({ email: FormBody.email });
		if (user) {
			const password = this.passwordEn(FormBody.password);
			await collections.users?.updateOne({ _id: user._id }, { $set: password });
			return this.json(res, 200, null, "Password updates successfully");
		}
		return this.jsonError(res, 400, this.__component, "User not found");
	}
	
	public notFoundHandler = (req: Request, res: Response, next: NextFunction): Response => {
		return this.json(res, 404)
	}
}
