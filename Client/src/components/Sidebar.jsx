import PropTypes from 'prop-types';

const Sidebar = ({ menuItems }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Sidebar
      </div>
      <ul className="mt-4">
        {menuItems.map((item, index) => (
          <li key={index} className="px-4 py-2 hover:bg-gray-700">
            {item}
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
