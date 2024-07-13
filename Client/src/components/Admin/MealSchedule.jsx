import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import mealData from '../../constant/order.json';

const MealScheduleComponent = () => {
    const [currentWeek, setCurrentWeek] = useState(dayjs().startOf('week'));
    const [mealSchedule, setMealSchedule] = useState({});

    useEffect(() => {
        fetchMealSchedule(currentWeek);
    }, [currentWeek]);

    const fetchMealSchedule = async (startDate) => {
        // TODO: Implement API call to fetch meal schedule data
        const mockSchedule = {};
        for (let i = 0; i < 7; i++) {
            const date = startDate.add(i, 'day').format('YYYY-MM-DD');
            mockSchedule[date] = {
                rice: Math.floor(Math.random() * mealData.rice.length) + 1,
                protein:
                    Math.floor(Math.random() * mealData.protein.length) + 1,
            };
        }
        setMealSchedule(mockSchedule);
    };

    const handleMealSelection = (date, type, id) => {
        setMealSchedule((prev) => ({
            ...prev,
            [date]: { ...prev[date], [type]: id },
        }));
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
                {items.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
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
