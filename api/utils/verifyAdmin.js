import User from "../models/user.model.js";
import { errorHandler } from "./errorHandler.js";

export const verifyAdmin = async(req, _, next) => {
    if (!req.user) {
        return next(errorHandler(401, 'Unauthorized'));
    }

    const checkAdmin = await User.findOne({ _id: req.user.id });

    if (!checkAdmin.isAdmin) {
        return next(errorHandler(403, 'Access Denied: Admins only'));
    }

    next();
};
