import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import PropTypes from "prop-types";

const Table = ({ columns, data, className, onDelete }) => {
  return (
    <div className={className}>
      <table className="min-w-full divide-y divide-gray-200">
        <TableHeader columns={columns} />
        <TableBody data={data} onDelete={onDelete} />
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
  onDelete: PropTypes.func,
};

export default Table;
