import PropTypes from "prop-types";

const Card = ({ title, content, className, ...props }) => {
  return (
    <div
      className={`bg-gray-800  text-gray-200 shadow-md rounded-lg overflow-hidden p-4 py-6 ${className}`}
      {...props}
    >
      {title && <div className="text-sm text-center mb-3">{title}</div>}
      {content && (
        <div className="text-gray-200 text-center text-2xl font-bold ">
          {content}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  className: PropTypes.string,
};

export default Card;
