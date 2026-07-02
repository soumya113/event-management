import { Row, Col, Form, Button } from "react-bootstrap";

const Toolbar = ({
  searchValue = "",
  onSearch,
  filterValue = "",
  onFilter,
  filters = [],
  buttonText = "",
  onButtonClick,
  showButton = true,
  searchPlaceholder = "Search...",
}) => {
  return (
    <Row className="align-items-center mb-4 g-3">
      <Col md={4}>
        <Form.Control
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </Col>

      <Col md={3}>
        <Form.Select
          value={filterValue}
          onChange={(e) => onFilter?.(e.target.value)}
        >
          <option value="">All Status</option>

          {filters.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Form.Select>
      </Col>

      <Col className="text-end">
        {showButton && (
          <Button onClick={onButtonClick}>{buttonText}</Button>
        )}
      </Col>
    </Row>
  );
};

export default Toolbar;