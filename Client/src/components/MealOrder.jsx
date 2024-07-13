import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import mealData from '../constant/order.json';

const MealOrderPage = () => {
    const [mealSchedule, setMealSchedule] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState({});
    const [currentWeek, setCurrentWeek] = useState([]);

    useEffect(() => {
        // Initialize the week with today's date
        const today = dayjs().startOf('day');
        const week = Array.from({ length: 7 }, (_, i) => today.add(i, 'day'));
        setCurrentWeek(week);
        // Fetch meal schedule (dummy data for now)
        setMealSchedule(mealData);
    }, []);

    const handleMealChange = (day, category, meal) => {
        setSelectedMeals({
            ...selectedMeals,
            [day]: {
                ...selectedMeals[day],
                [category]: meal,
            },
        });
    };

    const handleSaveMeals = () => {
        console.log('Saved Meals:', selectedMeals);
        // Save logic here (API call, etc.)
    };

    const isPastDay = (day) => {
        const today = dayjs().startOf('day');
        return day.isBefore(today);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-3xl font-semibold text-center text-white mb-8">
                    Meal Order Page
                </h2>
                <div className="flex justify-between mb-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                        onClick={() =>
                            setCurrentWeek(
                                currentWeek.map((day) => day.subtract(7, 'day'))
                            )
                        }
                    >
                        Previous Week
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                        onClick={() =>
                            setCurrentWeek(
                                currentWeek.map((day) => day.add(7, 'day'))
                            )
                        }
                    >
                        Next Week
                    </button>
                </div>
                <table className="min-w-full bg-gray-700 text-white rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-600 text-left">
                                Day
                            </th>
                            {Object.keys(mealData).map((category) => (
                                <th
                                    key={category}
                                    className="py-2 px-4 border-b border-gray-600 text-left"
                                >
                                    {category}
                                </th>
                            ))}
                            <th className="py-2 px-4 border-b border-gray-600 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentWeek.map((day) => (
                            <tr key={day.format()}>
                                <td className="py-2 px-4 border-b border-gray-600">
                                    {day.format('dddd, MMM D')}
                                </td>
                                {Object.keys(mealData).map((category) => (
                                    <td
                                        key={category}
                                        className="py-2 px-4 border-b border-gray-600"
                                    >
                                        <select
                                            disabled={isPastDay(day)}
                                            value={
                                                selectedMeals[
                                                    day.format('YYYY-MM-DD')
                                                ]?.[category] || ''
                                            }
                                            onChange={(e) =>
                                                handleMealChange(
                                                    day.format('YYYY-MM-DD'),
                                                    category,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white outline-none"
                                        >
                                            <option value="">
                                                Select {category}
                                            </option>
                                            {mealData[category].map((meal) => (
                                                <option
                                                    key={meal.id}
                                                    value={meal.name}
                                                >
                                                    {meal.name}
                                                </option>
                                            ))}
                                            <option value="No Meal">
                                                No Meal
                                            </option>
                                        </select>
                                    </td>
                                ))}
                                <td className="py-2 px-4 border-b border-gray-600">
                                    <button
                                        className="px-4 py-2 rounded-lg bg-green-500 text-white"
                                        onClick={handleSaveMeals}
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MealOrderPage;
