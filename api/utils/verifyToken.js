import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, _, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return next(errorHandler(401, "Unauthorized"));
        }

        req.user = user;
        next();
    });
};
