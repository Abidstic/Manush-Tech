// middleware/AdminMiddleware.js

const isAdmin = (req, res, next) => {
    // Check if user object exists (should be set by verifyToken middleware)
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if user role is admin
    if (req.user.role !== 'admin') {
        // Assuming role is the correct property
        return res
            .status(403)
            .json({ message: 'Access denied. Admin privileges required.' });
    }

    // If user is admin, proceed to next middleware or route handler
    next();
};

export { isAdmin };
