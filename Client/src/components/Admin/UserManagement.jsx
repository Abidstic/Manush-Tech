import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const usersPerPage = 5;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user', {
                headers: getAuthHeader(),
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            handleAuthError(error);
        }
    };

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleBanUser = async (id, banned) => {
        try {
            await axios.put(
                `http://localhost:8000/api/user/update/${id}`,
                { banned: !banned },
                {
                    headers: getAuthHeader(),
                }
            );
            fetchUsers();
        } catch (error) {
            console.error('Error banning/unbanning user:', error);
            handleAuthError(error);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.put(
                `http://localhost:8000/api/user/update/${id}`,
                { role: parseInt(newRole) }, // Send role as integer ID
                {
                    headers: getAuthHeader(),
                }
            );
            fetchUsers();
        } catch (error) {
            console.error('Error changing user role:', error);
            handleAuthError(error);
        }
    };

    const openModal = (user = null) => {
        setEditUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditUser(null);
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...editUser,
                role: parseInt(editUser.role), // Convert role to integer ID
                banned: editUser.banned || false, // Ensure banned is boolean
            };

            if (editUser.id) {
                await axios.put(
                    `http://localhost:8000/api/user/update/${editUser.id}`,
                    dataToSend,
                    {
                        headers: getAuthHeader(),
                    }
                );
            } else {
                await axios.post(
                    'http://localhost:8000/api/user/register',
                    dataToSend,
                    {
                        headers: getAuthHeader(),
                    }
                );
            }
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error('Error submitting user:', error);
            handleAuthError(error);
        }
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
                                            <option
                                                value="1"
                                                selected={user.role === 1}
                                            >
                                                Admin
                                            </option>
                                            <option
                                                value="2"
                                                selected={user.role === 2}
                                            >
                                                User
                                            </option>
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
                                                handleBanUser(
                                                    user.id,
                                                    user.banned
                                                )
                                            }
                                        >
                                            {user.banned ? 'Unban' : 'Ban'}
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
                                required={!editUser?.id}
                            />
                            <select
                                name="role"
                                value={editUser?.role || '2'} // Default to User if role is not set
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white outline-none"
                            >
                                <option value="1">Admin</option>
                                <option value="2">User</option>
                            </select>
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

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg bg-gray-600 text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                                >
                                    {editUser?.id ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
