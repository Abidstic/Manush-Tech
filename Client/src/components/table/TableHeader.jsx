import PropTypes from "prop-types";

const TableHeader = ({ columns }) => {
  return (
    <thead className="bg-gray-800 text-white">
      <tr>
        {columns.map((column, index) => (
          <th key={index} className="px-12 py-4 text-left">
            {column}
          </th>
        ))}
        <th className="px-12 py-4 text-left text-gray-200">Actions</th>
      </tr>
    </thead>
  );
};

TableHeader.propTypes = {
  columns: PropTypes.array.isRequired,
};

export default TableHeader;
