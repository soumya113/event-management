import Card from "react-bootstrap/Card";

const SummaryCard = ({ title, value, bg = "primary", icon }) => {
  return (
    <Card bg={bg} text="white" className="shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Card.Title>{title}</Card.Title>

            <h2>{value}</h2>
          </div>

          <div
            style={{
              fontSize: 35,
            }}
          >
            {icon}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SummaryCard;
