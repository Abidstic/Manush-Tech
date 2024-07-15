import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ItemManagement() {
    const [itemList, setItemList] = useState([]);
    const [newItem, setNewItem] = useState({ itemName: '', category: '' });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/api/items/',
                {
                    headers: getAuthHeader(),
                }
            );
            setItemList(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
            handleAuthError(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleAddItem = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/items/addItems',
                newItem,
                { headers: getAuthHeader() }
            );

            setItemList([...itemList, response.data]);
            setNewItem({ itemName: '', category: '' });
            setIsPopupOpen(false);
        } catch (error) {
            console.error('Error adding item:', error);
            handleAuthError(error);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/items/delete/${id}`, {
                headers: getAuthHeader(),
            });
            setItemList(itemList.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
            handleAuthError(error);
        }
    };

    const handleEditItem = (item) => {
        setIsPopupOpen(true);
        setIsEditing(true);
        setCurrentItem(item);
        setNewItem(item);
    };

    const handleUpdateItem = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/items/${currentItem.id}`,
                newItem,
                { headers: getAuthHeader() }
            );
            setItemList(
                itemList.map((item) =>
                    item.id === currentItem.id ? response.data : item
                )
            );
            setIsPopupOpen(false);
            setIsEditing(false);
            setCurrentItem(null);
            setNewItem({ itemName: '', category: '' });
        } catch (error) {
            console.error('Error updating item:', error);
            handleAuthError(error);
        }
    };

    const handleAuthError = (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.log('Unauthorized access. Redirecting to login...');
            // Implement your redirect logic here
        }
    };

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(itemList.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="flex-grow p-8">
                <h2 className="text-4xl font-bold text-center mb-12 text-blue-400">
                    Item Management
                </h2>
                <div className="max-w-6xl mx-auto">
                    <button
                        className="px-6 py-3 mb-8 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => setIsPopupOpen(true)}
                    >
                        Add Item
                    </button>
                    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="py-3 px-6 text-left">
                                        Name
                                    </th>
                                    <th className="py-3 px-6 text-left">
                                        Category
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className={
                                            index % 2 === 0
                                                ? 'bg-gray-800'
                                                : 'bg-gray-750'
                                        }
                                    >
                                        <td className="py-4 px-6">
                                            {item.itemName}
                                        </td>
                                        <td className="py-4 px-6">
                                            {item.category}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                className="px-4 py-2 mr-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-300"
                                                onClick={() =>
                                                    handleEditItem(item)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-300"
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
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-8">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`mx-1 px-4 py-2 rounded ${
                                    currentPage === i + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-gray-800 p-8 rounded-lg w-96 shadow-2xl">
                        <h3 className="text-2xl font-bold text-center text-blue-400 mb-6">
                            {isEditing ? 'Edit Item' : 'Add Item'}
                        </h3>
                        <input
                            type="text"
                            name="itemName"
                            placeholder="Item Name"
                            value={newItem.itemName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="category"
                            value={newItem.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mb-6 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select Category
                            </option>
                            {['Protein', 'Starch', 'Vegetables'].map(
                                (category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                )
                            )}
                        </select>
                        <div className="flex justify-end">
                            <button
                                className="px-6 py-2 mr-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition duration-300"
                                onClick={
                                    isEditing ? handleUpdateItem : handleAddItem
                                }
                            >
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                            <button
                                className="px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition duration-300"
                                onClick={() => {
                                    setIsPopupOpen(false);
                                    setIsEditing(false);
                                    setCurrentItem(null);
                                    setNewItem({ itemName: '', category: '' });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
