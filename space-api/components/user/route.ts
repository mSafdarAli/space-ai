import { route } from "../../__types";
import UserController from './controller';
const controller: UserController = new UserController();

const routes: route[] = [
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: false },
	{ path: controller.__component + '/', method: "get", function: controller.list, private: false },
	{ path: controller.__component + '/changePassword', method: "post", function: controller.changePassword, private: true },
];
export default routes;