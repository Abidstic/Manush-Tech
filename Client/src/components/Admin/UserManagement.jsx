import { useState } from 'react';
import userData from '../../constant/user.json';

// Mock data for demonstration
const usersWithMealChoices = userData.map((user) => ({
    ...user,
    mealChoices: [
        { day: 'Monday', choice: 'Chicken Curry' },
        { day: 'Tuesday', choice: 'Vegetable Curry' },
        { day: 'Wednesday', choice: 'Fish Curry' },
        // Add more meal choices as needed
    ],
}));

export default function UserList() {
    const [users, setUsers] = useState(usersWithMealChoices);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [mealChoicesUser, setMealChoicesUser] = useState(null); // State to track user for meal choices modal
    const usersPerPage = 5;

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleBanUser = (id) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, banned: !user.banned } : user
            )
        );
    };

    const handleRoleChange = (id, newRole) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, role: newRole } : user
            )
        );
    };

    const openModal = (user = null) => {
        setEditUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditUser(null);
        setIsModalOpen(false);
    };

    const openMealChoicesModal = (user) => {
        setMealChoicesUser(user);
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editUser.id) {
            setUsers(
                users.map((user) => (user.id === editUser.id ? editUser : user))
            );
        } else {
            setUsers([...users, { ...editUser, id: users.length + 1 }]);
        }
        closeModal();
    };

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users
        .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-6xl">
                <h2 className="text-3xl font-semibold text-center text-white mb-8">
                    User Management
                </h2>

                <div className="mb-4 w-full flex justify-between">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-2/3 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none"
                    />
                    <button
                        onClick={() => openModal()}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                    >
                        Add User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-700 text-white rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-600 text-left">
                                    Name
                                </th>
                                <th className="py-2 px-4 border-b border-gray-600 text-left">
                                    Email
                                </th>
                                <th className="py-2 px-4 border-b border-gray-600 text-left">
                                    Role
                                </th>
                                <th className="py-2 px-4 border-b border-gray-600 text-left">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b border-gray-600">
                                        {user.name}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-600">
                                        <select
                                            className="bg-gray-700 text-white rounded-lg"
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    user.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="User">User</option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-600 flex space-x-2">
                                        <button
                                            className="px-4 py-2 rounded-lg bg-yellow-500 text-white"
                                            onClick={() => openModal(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-lg ${
                                                user.banned
                                                    ? 'bg-red-500'
                                                    : 'bg-green-500'
                                            } text-white`}
                                            onClick={() =>
                                                handleBanUser(user.id)
                                            }
                                        >
                                            {user.banned ? 'Unban' : 'Ban'}
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                                            onClick={() =>
                                                openMealChoicesModal(user)
                                            }
                                        >
                                            View Meal Choices
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-center space-x-2">
                    {Array.from(
                        { length: Math.ceil(users.length / usersPerPage) },
                        (_, i) => (
                            <button
                                key={i}
                                className={`px-4 py-2 rounded-lg ${
                                    currentPage === i + 1
                                        ? 'bg-blue-500'
                                        : 'bg-gray-700'
                                } text-white`}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        )
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-gray-700 p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            {editUser?.id ? 'Update User' : 'Add User'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={editUser?.name || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white outline-none"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={editUser?.email || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white outline-none"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={editUser?.password || ''}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white outline-none"
                                required={!editUser?.id} // Only required when adding a new user
                            />
                            <select
                                name="role"
                                value={editUser?.role || 'User'}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white outline-none"
                            >
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                            </select>
                            <div className="flex items-center space-x-4">
                                <label className="text-white">
                                    Banned:
                                    <input
                                        type="checkbox"
                                        name="banned"
                                        checked={editUser?.banned || false}
                                        onChange={(e) =>
                                            setEditUser((prev) => ({
                                                ...prev,
                                                banned: e.target.checked,
                                            }))
                                        }
                                        className="ml-2"
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-green-500 text-white"
                                >
                                    {editUser?.id ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for Viewing Meal Choices */}
            {mealChoicesUser && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-gray-700 p-8 rounded-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            Meal Choices for {mealChoicesUser.name}
                        </h2>
                        <div className="space-y-4">
                            {mealChoicesUser.mealChoices.map(
                                (choice, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between py-2 px-4 bg-gray-600 rounded-lg"
                                    >
                                        <span className="text-white">
                                            {choice.day}
                                        </span>
                                        <span className="text-white">
                                            {choice.choice}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setMealChoicesUser(null)}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
