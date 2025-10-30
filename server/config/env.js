import { config } from "dotenv";

config({path : `.env.${process.env.NODE_ENV || 'development'}.local`});


export const {
    PORT, 
    NODE_ENV, 
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    FINNHUB_BASE_URL,
    FINNHUB_API_KEY,
    EMAIL_USER,
    EMAIL_PASS
} = process.env;
