import { Card, Row, Col } from "react-bootstrap";
import StatusBadge from "../../components/StatusBadge";

const DetailItem = ({ label, value }) => (
  <Col md={6} className="mb-3">
    <div className="fw-semibold text-muted">{label}</div>
    <div>{value || "-"}</div>
  </Col>
);

const CustomerDetails = ({ customer }) => {
  if (!customer) {
    return (
      <div className="text-center text-muted py-4">
        No customer selected.
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <Row>
          <DetailItem label="Customer Name" value={customer.name} />

          <DetailItem label="Mobile Number" value={customer.mobile} />

          <DetailItem label="Email" value={customer.email} />

          <DetailItem label="Project Name" value={customer.projectName} />

          <DetailItem label="QR Code" value={customer.qrCode} />

          <Col md={6} className="mb-3">
            <div className="fw-semibold text-muted">Event Status</div>

            <StatusBadge status={customer.eventStatus} />
          </Col>

          <DetailItem
            label="Assigned Booth"
            value={customer.assignedBooth}
          />

          <DetailItem
            label="Sales Manager"
            value={customer.salesManagerName}
          />

          <DetailItem
            label="Remarks"
            value={customer.remarks}
          />

          <DetailItem
            label="Follow-up Date"
            value={customer.followUpDate}
          />

          <DetailItem
            label="Created At"
            value={customer.createdAt}
          />

          <DetailItem
            label="Updated At"
            value={customer.updatedAt}
          />
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CustomerDetails;