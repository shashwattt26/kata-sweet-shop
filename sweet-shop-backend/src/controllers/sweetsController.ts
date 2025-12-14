import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Sweet } from '../entity/Sweet';

export const addSweet = async (req: Request, res: Response) => {
    try {
        const { name, category, price, quantity } = req.body;

        const sweetRepository = AppDataSource.getRepository(Sweet);
        
        const sweet = new Sweet();
        sweet.name = name;
        sweet.category = category;
        sweet.price = price;
        sweet.quantity = quantity;

        await sweetRepository.save(sweet);

        return res.status(201).json({ message: "Sweet added successfully", sweet });
    } catch (error) {
        return res.status(500).json({ message: "Error adding sweet" });
    }
};