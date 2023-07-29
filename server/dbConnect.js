import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config();

mongoose.set("strictQuery", false);
const connect = mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	
connect  ? console.log("Database connected") : console.log("Database disconnected")