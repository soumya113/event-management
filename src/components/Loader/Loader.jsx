import Spinner from "react-bootstrap/Spinner";

const Loader = ({
  text = "Loading...",
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center py-5 ${className}`}
    >
      <Spinner animation="border" role="status" size={size}>
        <span className="visually-hidden">{text}</span>
      </Spinner>

      <p className="mt-3 mb-0 text-muted">{text}</p>
    </div>
  );
};

export default Loader;