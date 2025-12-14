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

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const sweetRepository = AppDataSource.getRepository(Sweet);
        const sweets = await sweetRepository.find();
        return res.status(200).json(sweets);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving sweets" });
    }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sweetRepository = AppDataSource.getRepository(Sweet);
        
        // 1. Find the sweet
        const sweet = await sweetRepository.findOneBy({ id: parseInt(id) });

        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }

        // 2. Merge new data into the existing object
        sweetRepository.merge(sweet, req.body);

        // 3. Save changes
        const results = await sweetRepository.save(sweet);

        return res.status(200).json({ message: "Sweet updated successfully", sweet: results });
    } catch (error) {
        return res.status(500).json({ message: "Error updating sweet" });
    }
};


export const deleteSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const sweetRepository = AppDataSource.getRepository(Sweet);
        
        const result = await sweetRepository.delete(id);

        if (result.affected === 0) {
            return res.status(404).json({ message: "Sweet not found" });
        }

        return res.status(200).json({ message: "Sweet deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting sweet" });
    }
};

export const purchaseSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body; // Expect quantity from frontend
        const qtyToBuy = quantity || 1; // Default to 1 if not specified

        const sweetRepository = AppDataSource.getRepository(Sweet);
        const sweet = await sweetRepository.findOneBy({ id: parseInt(id) });

        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }

        if (sweet.quantity < qtyToBuy) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Decrease quantity
        sweet.quantity -= qtyToBuy;
        await sweetRepository.save(sweet);

        return res.status(200).json({ message: "Purchase successful", sweet });
    } catch (error) {
        return res.status(500).json({ message: "Error processing purchase" });
    }
};

export const restockSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body; 
        const qtyToAdd = quantity || 1; 

        const sweetRepository = AppDataSource.getRepository(Sweet);
        const sweet = await sweetRepository.findOneBy({ id: parseInt(id) });

        if (!sweet) {
            return res.status(404).json({ message: "Sweet not found" });
        }

        // Increase quantity
        sweet.quantity += qtyToAdd;
        await sweetRepository.save(sweet);

        return res.status(200).json({ message: "Restock successful", sweet });
    } catch (error) {
        return res.status(500).json({ message: "Error restocking sweet" });
    }
};