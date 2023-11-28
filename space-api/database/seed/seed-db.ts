import { ObjectId } from "mongodb";
import Utility from "../../helpers/utility";
import { Role, User } from "../../models";
import { collections } from "../db";
import { Roles } from "./roles";

const utility = new Utility;
const data: {
	roles: Role[]
	users: User[]
	// properties: Property[]
} = {
	roles: Roles,
	users: [
		{
			_id: new ObjectId(), name: "admin", account_type: "SuperAdmin", email: "admin@gmail.com", roleId: Roles[0]._id, ...utility.passwordEn("Test@123"), isProfileCompleted: true,
		},
	]
}
export default class Seed {
	public async runSeed() {
		await collections.roles?.insertMany(data.roles); 
		await collections.users?.insertMany(data.users);
		console.log('Data is seeded');
	}
}