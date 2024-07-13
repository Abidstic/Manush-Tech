import { useState, useEffect } from 'react';
import dayjs from 'dayjs'; // For date manipulation
import orderData from '../../constant/order.json'; // Replace with actual path

const MealSchedule = () => {
    const [mealOrders, setMealOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().startOf('week'));
    const [newOrder, setNewOrder] = useState({ starch: '', protein: '' });

    useEffect(() => {
        // Simulating fetching data from API or local storage
        // Replace with actual data fetching logic
        setMealOrders(orderData);
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleMealChange = (orderId, field, value) => {
        const updatedOrders = mealOrders.map((order) =>
            order.id === orderId ? { ...order, [field]: value } : order
        );
        setMealOrders(updatedOrders);
    };

    const handleAddOrder = () => {
        const newId = mealOrders.length + 1; // Replace with actual ID generation logic
        const newOrderWithId = {
            id: newId,
            date: selectedDate.format('YYYY-MM-DD'),
            ...newOrder,
        };
        setMealOrders([...mealOrders, newOrderWithId]);
        setNewOrder({ starch: '', protein: '' }); // Clear form after adding
    };

    const handleDeleteOrder = (orderId) => {
        const updatedOrders = mealOrders.filter(
            (order) => order.id !== orderId
        );
        setMealOrders(updatedOrders);
    };

    const renderMealSchedule = () => {
        const currentWeekStart = dayjs(selectedDate).startOf('week');
        const currentWeekEnd = dayjs(selectedDate).endOf('week');
        const days = [];
        let currentDate = dayjs(currentWeekStart);

        while (currentDate <= currentWeekEnd) {
            days.push(dayjs(currentDate));
            currentDate = dayjs(currentDate).add(1, 'day');
        }

        return (
            <div className="meal-schedule">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Weekly Meal Schedule
                </h2>
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() =>
                            handleDateChange(
                                dayjs(selectedDate).subtract(7, 'days')
                            )
                        }
                        className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
                    >
                        Previous Week
                    </button>
                    <button
                        onClick={() =>
                            handleDateChange(dayjs(selectedDate).add(7, 'days'))
                        }
                        className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 focus:outline-none"
                    >
                        Next Week
                    </button>
                </div>
                <div className="table-container">
                    <table className="w-full bg-gray-800 text-white rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="py-2 px-4 border-b border-gray-600">
                                    Date
                                </th>
                                <th className="py-2 px-4 border-b border-gray-600">
                                    Starch
                                </th>
                                <th className="py-2 px-4 border-b border-gray-600">
                                    Protein
                                </th>
                                <th className="py-2 px-4 border-b border-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day) => {
                                const order = mealOrders.find(
                                    (order) =>
                                        order.date === day.format('YYYY-MM-DD')
                                );
                                return (
                                    <tr
                                        key={day.format('YYYY-MM-DD')}
                                        className="hover:bg-gray-700"
                                    >
                                        <td className="py-2 px-4 border-b border-gray-600">
                                            {day.format('MMM DD')}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-600">
                                            <select
                                                className="bg-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none"
                                                value={
                                                    order ? order.starch : ''
                                                }
                                                onChange={(e) =>
                                                    handleMealChange(
                                                        order.id,
                                                        'starch',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Starch
                                                </option>
                                                <option value="Rice">
                                                    Rice
                                                </option>
                                                <option value="Potato Bhorta">
                                                    Potato Bhorta
                                                </option>
                                                <option value="Daal">
                                                    Daal
                                                </option>
                                                {/* Add more starch options */}
                                            </select>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-600">
                                            <select
                                                className="bg-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none"
                                                value={
                                                    order ? order.protein : ''
                                                }
                                                onChange={(e) =>
                                                    handleMealChange(
                                                        order.id,
                                                        'protein',
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Protein
                                                </option>
                                                <option value="Chicken Curry">
                                                    Chicken Curry
                                                </option>
                                                <option value="Fish Curry">
                                                    Fish Curry
                                                </option>
                                                <option value="Egg Curry">
                                                    Egg Curry
                                                </option>
                                                {/* Add more protein options */}
                                            </select>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-600">
                                            <button
                                                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none mr-2"
                                                onClick={() =>
                                                    handleMealChange(
                                                        order.id,
                                                        order
                                                    )
                                                }
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 focus:outline-none"
                                                onClick={() =>
                                                    handleDeleteOrder(order.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                        Add New Meal Schedule
                    </h3>
                    <div className="flex items-center space-x-4">
                        <select
                            className="bg-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none"
                            value={newOrder.starch}
                            onChange={(e) =>
                                setNewOrder({
                                    ...newOrder,
                                    starch: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Starch</option>
                            <option value="Rice">Rice</option>
                            <option value="Potato Bhorta">Potato Bhorta</option>
                            <option value="Daal">Daal</option>
                            {/* Add more starch options */}
                        </select>
                        <select
                            className="bg-gray-700 text-white rounded-lg px-2 py-1 focus:outline-none"
                            value={newOrder.protein}
                            onChange={(e) =>
                                setNewOrder({
                                    ...newOrder,
                                    protein: e.target.value,
                                })
                            }
                        >
                            <option value="">Select Protein</option>
                            <option value="Chicken Curry">Chicken Curry</option>
                            <option value="Fish Curry">Fish Curry</option>
                            <option value="Egg Curry">Egg Curry</option>
                            {/* Add more protein options */}
                        </select>
                        <button
                            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600 focus:outline-none"
                            onClick={handleAddOrder}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl">
                {renderMealSchedule()}
            </div>
        </div>
    );
};

export default MealSchedule;
