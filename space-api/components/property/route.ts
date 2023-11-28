import { route } from "../../__types";
import PropertyController from './controller';
const controller: PropertyController = new PropertyController();

const routes: route[] = [
	{ path: controller.__component + '/:id', method: "get", function: controller.get, private: false },
	{ path: controller.__component + '/', method: "get", function: controller.list, private: false },

];
export default routes;