import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    // Format is "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        // Attach user info to request object for use in controllers
        (req as any).user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};