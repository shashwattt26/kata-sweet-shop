import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';

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