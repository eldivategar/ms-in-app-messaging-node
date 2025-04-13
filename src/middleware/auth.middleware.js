const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.query.token;

    if (!token) {
        return res.status(403).json({
            status: 'error',
            message: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Extract user data from the nested structure
        req.user = {
            id: decoded.data.id,
            name: decoded.data.name,
            email: decoded.data.email,
            role: decoded.data.role_name,
            phone: decoded.data.phone
        };
        next();
    } catch (err) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
    }
};

module.exports = {
    verifyToken
}; 