import { Collection , Db, MongoClient } from "mongodb";
import config from "../config/config";
import { User, Role, Property} from "../models";
const tables = ['users', 'roles', 'properties'];
export const collections: {
	properties?: Collection<Property>,
	roles?: Collection<Role>,
	users?: Collection<User>
} = {}

export async function connectToDatabase() {

	const client: MongoClient = new MongoClient(config.db.DB_CONN_STRING);

	await client.connect();

	const db: Db = client.db(config.db.database);
	if(db){
		console.log('connect')
	}
	tables.forEach((collection) => {
		collections[collection] = db.collection(collection);
	})
	return db;
}

