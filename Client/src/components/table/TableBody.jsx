import PropTypes from "prop-types";

const TableBody = ({ data, onDelete }) => {

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className="bg-white border-b hover:bg-gray-100 cursor-pointer"
        >
          {Object.values(row).map((cell, cellIndex) => (
            <td key={cellIndex} className="px-12 py-4 text-gray-700">
              {typeof cell === "boolean" ? (cell ? "Yes" : "No") : cell}
            </td>
          ))}
          <td className="px-12 py-2 text-gray-700">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => onDelete(row.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

TableBody.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func
};

export default TableBody;
