import { config } from 'dotenv';
config();
export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_URL,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
  GMAIL_ACCOUNT,
  GMAIL_PASSWORD,
} = process.env;
