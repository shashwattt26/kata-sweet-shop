import { useEffect, useState } from 'react';
import api from '../api/axios';
import { type Sweet } from '../types';
import AddSweetForm from '../components/AddSweetForm'; // Make sure this path is correct

export default function Dashboard() {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch sweets on load
    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            const response = await api.get('/sweets');
            setSweets(response.data);
        } catch (err) {
            setError('Failed to load sweets');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (id: number) => {
        try {
            await api.post(`/sweets/${id}/purchase`, { quantity: 1 });
            alert('Purchase successful!');
            fetchSweets(); 
        } catch (err: any) {
            alert(err.response?.data?.message || 'Purchase failed');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading treats...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">🍬 Sweet Shop Dashboard</h1>
                    <button 
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                        className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>

                {/* The new Form Component */}
                <AddSweetForm onSuccess={fetchSweets} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sweets.map((sweet) => (
                        <div key={sweet.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{sweet.name}</h3>
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                                        {sweet.category}
                                    </span>
                                </div>
                                <span className="text-lg font-bold text-green-600">${sweet.price}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-sm text-gray-500">
                                    Stock: <span className={`font-medium ${sweet.quantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                                        {sweet.quantity}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handlePurchase(sweet.id)}
                                    disabled={sweet.quantity === 0}
                                    className={`px-4 py-2 rounded-md text-white transition ${
                                        sweet.quantity === 0 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                                >
                                    {sweet.quantity === 0 ? 'Sold Out' : 'Buy Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}