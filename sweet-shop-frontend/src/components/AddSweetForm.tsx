import { useState } from 'react';
import api from '../api/axios';

interface Props {
    onSuccess: () => void; // Callback to refresh the list after adding
}

export default function AddSweetForm({ onSuccess }: Props) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/sweets', {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity)
            });
            alert('Sweet added successfully!');
            setFormData({ name: '', category: '', price: '', quantity: '' }); // Reset form
            onSuccess();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error adding sweet (Are you Admin?)');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Sweet (Admin)</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 md:grid-cols-5 items-end">
                <input 
                    placeholder="Name" 
                    className="border p-2 rounded"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
                <input 
                    placeholder="Category" 
                    className="border p-2 rounded"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                />
                <input 
                    type="number" step="0.01" placeholder="Price" 
                    className="border p-2 rounded"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required
                />
                <input 
                    type="number" placeholder="Qty" 
                    className="border p-2 rounded"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    required
                />
                <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    + Add Sweet
                </button>
            </form>
        </div>
    );
}