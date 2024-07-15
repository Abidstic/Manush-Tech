import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';

const MealOrderPage = () => {
    const [mealSchedule, setMealSchedule] = useState({});
    const [selectedMeals, setSelectedMeals] = useState({});
    const [currentWeek, setCurrentWeek] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const today = dayjs().startOf('day');
        const week = Array.from({ length: 7 }, (_, i) => today.add(i, 'day'));
        setCurrentWeek(week);
        fetchWeeklySchedule();
    }, []);

    const fetchWeeklySchedule = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/api/order/weekly-schedule'
            );
            if (response.data && typeof response.data === 'object') {
                setMealSchedule(response.data);
            } else {
                throw new Error('Unexpected data format from API');
            }
        } catch (error) {
            console.error('Error fetching weekly schedule:', error);
            setError('Failed to fetch meal schedule. Please try again later.');
        }
    };

    const handleMealChange = (day, mealId) => {
        setSelectedMeals({
            ...selectedMeals,
            [day]: mealId,
        });
    };

    const handleSaveMeal = async (day) => {
        const mealId = selectedMeals[day];
        if (!mealId) return;

        try {
            await axios.post('http://localhost:8000/api/order/update-choice', {
                userId: 1, 
                scheduleId: mealId,
                orderDate: day,
            });
            console.log('Meal saved successfully for', day);
        } catch (error) {
            console.error('Error saving meal:', error);
            setError('Failed to save meal. Please try again.');
        }
    };

    const handleScheduleMonth = async () => {
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();

        try {
            await axios.post('http://localhost:8000/api/order/schedule-month', {
                userId: 1,
                month: currentMonth,
                year: currentYear,
                mealChoices: selectedMeals,
            });
            console.log('Monthly meals scheduled successfully');
        } catch (error) {
            console.error('Error scheduling monthly meals:', error);
            setError('Failed to schedule monthly meals. Please try again.');
        }
    };

    const isPastDay = (day) => {
        const today = dayjs().startOf('day');
        return day.isBefore(today);
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl">
                <h2 className="text-3xl font-semibold text-center text-white mb-8">
                    Meal Order Page
                </h2>
                <div className="flex justify-between mb-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                        onClick={() => {
                            setCurrentWeek(
                                currentWeek.map((day) => day.subtract(7, 'day'))
                            );
                            fetchWeeklySchedule();
                        }}
                    >
                        Previous Week
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white"
                        onClick={() => {
                            setCurrentWeek(
                                currentWeek.map((day) => day.add(7, 'day'))
                            );
                            fetchWeeklySchedule();
                        }}
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
                            <th className="py-2 px-4 border-b border-gray-600 text-left">
                                Meal
                            </th>
                            <th className="py-2 px-4 border-b border-gray-600 text-left">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentWeek.map((day) => {
                            const dayOfWeek = day.format('dddd');
                            const meals = mealSchedule[dayOfWeek] || [];
                            return (
                                <tr key={day.format()}>
                                    <td className="py-2 px-4 border-b border-gray-600">
                                        {day.format('dddd, MMM D')}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-600">
                                        <select
                                            disabled={isPastDay(day)}
                                            value={
                                                selectedMeals[
                                                    day.format('YYYY-MM-DD')
                                                ] || ''
                                            }
                                            onChange={(e) =>
                                                handleMealChange(
                                                    day.format('YYYY-MM-DD'),
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white outline-none"
                                        >
                                            <option value="">
                                                Select Meal
                                            </option>
                                            {meals.map((meal) => (
                                                <option
                                                    key={meal.id}
                                                    value={meal.id}
                                                >
                                                    {meal.mealName}
                                                </option>
                                            ))}
                                            <option value="No Meal">
                                                No Meal
                                            </option>
                                        </select>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-600">
                                        <button
                                            className="px-4 py-2 rounded-lg bg-green-500 text-white"
                                            onClick={() =>
                                                handleSaveMeal(
                                                    day.format('YYYY-MM-DD')
                                                )
                                            }
                                            disabled={isPastDay(day)}
                                        >
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="mt-4">
                    <button
                        className="px-4 py-2 rounded-lg bg-purple-500 text-white"
                        onClick={handleScheduleMonth}
                    >
                        Schedule for Entire Month
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealOrderPage;
