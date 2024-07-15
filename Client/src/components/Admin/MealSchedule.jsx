import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

const MealScheduleComponent = () => {
    const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week'));
    const [mealSchedule, setMealSchedule] = useState({});
    const [isAdmin, setIsAdmin] = useState(false); // Assume we have a way to determine if the user is an admin
    const [mealData, setMealData] = useState({ rice: [], protein: [] }); // State to store meal options

    useEffect(() => {
        fetchMealSchedule(currentWeek);
        fetchMealData(); // Fetch meal options when component mounts
    }, [currentWeek]);

    const fetchMealSchedule = async (startDate) => {
        try {
            const userId = localStorage.getItem('userId'); // Assume we store user ID in localStorage
            const endpoint = isAdmin
                ? '/api/schedule/all'
                : `/api/schedule/user/${userId}`;
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Assume we store JWT in localStorage
                },
            });

            const formattedSchedule = {};
            response.data.forEach((choice) => {
                const date = dayjs(choice.orderDate).format('YYYY-MM-DD');
                if (!formattedSchedule[date]) {
                    formattedSchedule[date] = {};
                }
                formattedSchedule[date][choice.mealSchedule.meal.type] =
                    choice.mealSchedule.meal.id;
            });

            setMealSchedule(formattedSchedule);
        } catch (error) {
            console.error('Error fetching meal schedule:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const fetchMealData = async () => {
        try {
            const response = await axios.get('/api/meals'); // Replace with your actual endpoint to fetch meal options
            setMealData({
                rice: response.data.rice,
                protein: response.data.protein,
            });
        } catch (error) {
            console.error('Error fetching meal data:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const handleMealSelection = async (date, type, id) => {
        try {
            await axios.post(
                '/api/schedule/update',
                {
                    date,
                    mealType: type,
                    mealId: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );

            setMealSchedule((prev) => ({
                ...prev,
                [date]: { ...prev[date], [type]: id },
            }));
        } catch (error) {
            console.error('Error updating meal selection:', error);
            // Handle error (e.g., show error message to user)
        }
    };

    const renderMealSelector = (date, type) => {
        const items = type === 'rice' ? mealData.rice : mealData.protein;
        const selectedId = mealSchedule[date] ? mealSchedule[date][type] : '';

        return (
            <select
                value={selectedId}
                onChange={(e) =>
                    handleMealSelection(date, type, Number(e.target.value))
                }
                className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Select {type}</option>
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Loading...</option>
                )}
            </select>
        );
    };

    const renderWeek = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = currentWeek.add(i, 'day');
            const dateStr = date.format('YYYY-MM-DD');
            days.push(
                <div key={i} className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {date.format('ddd, MMM D')}
                    </h3>
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm text-gray-300">
                                Rice:
                            </label>
                            {renderMealSelector(dateStr, 'rice')}
                        </div>
                        <div>
                            <label className="text-sm text-gray-300">
                                Protein:
                            </label>
                            {renderMealSelector(dateStr, 'protein')}
                        </div>
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">
                    Meal Schedule
                </h2>
                <div className="flex justify-between mb-6">
                    <button
                        onClick={() =>
                            setCurrentWeek((prev) => prev.subtract(1, 'week'))
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Previous Week
                    </button>
                    <button
                        onClick={() =>
                            setCurrentWeek((prev) => prev.add(1, 'week'))
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Next Week
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {renderWeek()}
                </div>
            </div>
        </div>
    );
};

export default MealScheduleComponent;
