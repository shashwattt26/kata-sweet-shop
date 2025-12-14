import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    // We assume authenticateToken has already run and attached `req.user`
    const user = (req as any).user;

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
};