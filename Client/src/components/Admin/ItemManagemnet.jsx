import { useState } from 'react';
import items from '../../constant/items.json';

const categories = ['Protein', 'Starch', 'Vegetables', 'Soup'];

export default function ItemManagement() {
    const [itemList, setItemList] = useState(items);
    const [newItem, setNewItem] = useState({ name: '', category: '' });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = () => {
        setItemList([...itemList, { ...newItem, id: itemList.length + 1 }]);
        setNewItem({ name: '', category: '' });
        setIsPopupOpen(false);
    };

    const handleDeleteItem = (id) => {
        setItemList(itemList.filter((item) => item.id !== id));
    };

    const handleEditItem = (item) => {
        setIsPopupOpen(true);
        setIsEditing(true);
        setCurrentItem(item);
        setNewItem(item);
    };

    const handleUpdateItem = () => {
        setItemList(
            itemList.map((item) =>
                item.id === currentItem.id ? newItem : item
            )
        );
        setIsPopupOpen(false);
        setIsEditing(false);
        setCurrentItem(null);
        setNewItem({ name: '', category: '' });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-3xl font-semibold text-center text-white mb-8">
                    Item Management
                </h2>
                <button
                    className="px-4 py-2 mb-4 rounded-lg bg-blue-500 text-white"
                    onClick={() => setIsPopupOpen(true)}
                >
                    Add Item
                </button>
                <table className="min-w-full bg-gray-700 text-white rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-600 text-left">
                                Name
                            </th>
                            <th className="py-2 px-4 border-b border-gray-600 text-left">
                                Category
                            </th>
                            <th className="py-2 px-4 border-b border-gray-600 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemList.map((item) => (
                            <tr key={item.id}>
                                <td className="py-2 px-4 border-b border-gray-600">
                                    {item.name}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-600">
                                    {item.category}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-600 text-center">
                                    <button
                                        className="px-4 py-2 mr-2 rounded-lg bg-yellow-500 text-white"
                                        onClick={() => handleEditItem(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-lg bg-red-500 text-white"
                                        onClick={() =>
                                            handleDeleteItem(item.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                        <div className="bg-gray-800 p-8 rounded-lg w-96">
                            <h3 className="text-xl font-semibold text-center text-white mb-4">
                                {isEditing ? 'Edit Item' : 'Add Item'}
                            </h3>
                            <input
                                type="text"
                                name="name"
                                placeholder="Item Name"
                                value={newItem.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white outline-none"
                            />
                            <select
                                name="category"
                                value={newItem.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white outline-none"
                            >
                                <option value="" disabled>
                                    Select Category
                                </option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end">
                                <button
                                    className="px-4 py-2 mr-2 rounded-lg bg-green-500 text-white"
                                    onClick={
                                        isEditing
                                            ? handleUpdateItem
                                            : handleAddItem
                                    }
                                >
                                    {isEditing ? 'Update' : 'Add'}
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg bg-gray-500 text-white"
                                    onClick={() => {
                                        setIsPopupOpen(false);
                                        setIsEditing(false);
                                        setCurrentItem(null);
                                        setNewItem({ name: '', category: '' });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
