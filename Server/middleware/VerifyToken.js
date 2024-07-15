import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Get token from headers
    const authorizationHeader =
        req.headers.authorization || req.headers.Authorization;
    let token = null;

    // Handle Bearer token format
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        token = authorizationHeader.slice(7, authorizationHeader.length);
    } else {
        token = authorizationHeader;
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    // Check if JWT secret is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: 'JWT secret is not defined.' });
    }
    const decoded = jwt.verify(token, jwtSecret);

    try {
        // Verify token
        const decoded = jwt.verify(token, jwtSecret);

        req.user = {
            userId: decoded.userId,
            userRole: decoded.userRole,
        };
        console.log('in the verify');

        // Call next middleware or route handler
        next();
    } catch (err) {
        return res
            .status(403)
            .json({ message: 'Failed to authenticate token.' });
    }
};

export default verifyToken;
