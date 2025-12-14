import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        
        // 1. Check if user exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ username });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create and save user
        const user = new User();
        user.username = username;
        user.password = hashedPassword;
        user.role = 'user'; // Default role

        await userRepository.save(user);

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate Token
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            'YOUR_SECRET_KEY', // In a real app, use process.env.JWT_SECRET
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};