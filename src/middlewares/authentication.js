import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw "No authentication token found!";
        }
        // TOKEN will be sent inside req authorization headers as bearer
        const token = authorization.split(" ")[1];
        const decoodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoodedData.id;
        req.email = decoodedData.email;
        next();
    } catch (error) {
        next(error);
    }
}