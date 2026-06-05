const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        
        // Check if token has Bearer prefix
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. Invalid token format.' });
        }
        
        // Extract token from Bearer prefix
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user info to request object
        req.user = decoded;
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Access denied. Invalid token.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access denied. Token expired.' });
        } else {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = authMiddleware;
