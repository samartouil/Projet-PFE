const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const checkAdminRole = (requiredRole) => (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token is missing" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (requiredRole.includes(decoded.user.role)) {
            next();
        } else {
            return res.status(403).json({ error: "Forbidden: You do not have permission" });
        }
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

module.exports = { checkAdminRole };