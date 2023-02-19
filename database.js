/**
 * Pius Gumo
 * 24/12/2022
 * 
 * This file contains the database connection code.
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv'
dotenv.config()

const checkEnv = () => {
    if (!process.env.DB_URL) {
        throw new Error('DB_URL is not defined!');
    }
    if (!process.env.DB_NAME) {
        throw new Error('DB_NAME is not defined!');
    }
}

export const dbConnection = async () => {
    checkEnv();
    // check if the connection has already been established
    if (global.db) {
        return global.db;
    } else {
        console.log('Establishing a new connection to the database...');
        // establish a new connection
        const client = await connectToDatabase()
        return client.db(process.env.DB_NAME);
    }
}

const connectToDatabase = async () => {
    console.log('Connecting to the database...');
    checkEnv();
    const client = new MongoClient(process.env.DB_URL, { useUnifiedTopology: true });
    return client;
}
