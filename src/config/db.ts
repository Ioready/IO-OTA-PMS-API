import mongoose from 'mongoose'
import { config } from './env.config';

const DBconnection = async () => {
	mongoose.set('strictQuery', true);
	await mongoose.connect(config.db.url as string)
		.then((conn) => {
			console.log(
				`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
			)
		})
		.catch((err) => {
			console.log(`For some reasons we couldn't connect to the DB`.red, err)
		})
}

export default DBconnection