import { useNavigate } from 'react-router-dom';

const BannedUserCard = () => {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/register');
    };

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md flex items-center justify-between">
            <p className="font-semibold">User is Banned</p>
            <button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
                Cancel
            </button>
        </div>
    );
};

export default BannedUserCard;
