import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Sidebar = ({ menuItems }) => {
    return (
        <div className="h-screen w-64 bg-gray-800 text-white">
            <ul className="mt-4">
                {menuItems.map((item, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-700">
                        <Link to={item.path} className="block">
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

Sidebar.propTypes = {
    menuItems: PropTypes.array.isRequired,
};

export default Sidebar;
