import { ObjectId } from "mongodb";
import { Role } from "../../models";

export const Roles: Role[] = [
	{
		_id: new ObjectId(),
		name: "Super Admin",
		permissions: {
			"dashboard": {
				view: true,
			}
		}
	},
	{
		_id: new ObjectId(),
		name: "Admin",
		permissions: {
			dashboard: {
				view: true
			}
		}
	},
]