import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            values.name &&
            values.password &&
            values.email &&
            values.confirmPassword
        ) {
            try {
                const response = await axios.post(
                    'http://localhost:8000/api/user/register',
                    values
                );

                const { userId, token } = response.data;
                console.log('login Successful');

                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);
            } catch (error) {
                console.error('Signup Error:', error);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-3xl font-semibold text-center text-white mb-8">
                    Sign Up
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={values.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={values.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
