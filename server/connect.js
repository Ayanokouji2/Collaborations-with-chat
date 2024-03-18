import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.MONGO_URL;

mongoose
    .connect(url)
    .then(database => {
        console.log(`Database connected`);
    }).catch(error => {
        console.log(`Error Caught..❌`)
    })