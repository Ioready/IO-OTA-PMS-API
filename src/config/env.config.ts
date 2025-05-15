import dotenv from 'dotenv';
import { url } from 'inspector';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
    app: {
        port: process.env.PORT || 8080,
        env: process.env.NODE_ENV || 'development',
        apiPrefix: process.env.API_VERSION_PATH || '/api/v1',
    },
    db: {
        // host: process.env.DB_HOST,
        // port: Number(process.env.DB_PORT),
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        //   name: process.env.DB_NAME,
        url: process.env.MONGO_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        refreshTexpiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        cookieExpiry: process.env.COOKIE_EXPIRY,
    },
    cookie: {
        oneDay: process.env.COOKIE_1D_EXPIRY,
        oneHour: process.env.COOKIE_1H_EXPIRY
    },
    url: {
        base: process.env.BASE_URL
    },
    oauth: {
        google: process.env.GOOGLE_OAUTH
    },
    smpt: {
        host: process.env.GOOGLE_OAUTH,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_EMAIL,
        password: process.env.SMTP_PASSWORD,
    },
    email: {
        name: process.env.FROM_NAME,
        from: process.env.FROM_EMAIL,
    },
    zeptoMail: {
        token: process.env.EMAIL_TOKEN,
        url: process.env.EMAIL_BASE_URL,
        template: {
            otp: process.env.TEMP_OTP
        }
    },
};
