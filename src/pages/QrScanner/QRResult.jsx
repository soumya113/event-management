import { Card, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";

const QRResult = ({
  customer,
  onSuccess,
}) => {
  if (!customer)
    return (
      <Card>
        <Card.Body>
          No Customer Selected
        </Card.Body>
      </Card>
    );

  const checkIn = async () => {
    try {
      await apiService.post(
        apiPath.CHECK_IN,
        {
          qrCode: customer.qrCode,
        }
      );

      toast.success(
        "Checked In Successfully"
      );

      onSuccess();
    } catch (err) {
      toast.error(
        err.response?.data?.message
      );
    }
  };

  return (
    <Card>
      <Card.Header>
        Customer Details
      </Card.Header>

      <Card.Body>
        <Table bordered>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{customer.name}</td>
            </tr>

            <tr>
              <th>Mobile</th>
              <td>{customer.mobile}</td>
            </tr>

            <tr>
              <th>Email</th>
              <td>{customer.email}</td>
            </tr>

            <tr>
              <th>Project</th>
              <td>
                {customer.projectName}
              </td>
            </tr>

            <tr>
              <th>Status</th>
              <td>
                {customer.eventStatus}
              </td>
            </tr>
          </tbody>
        </Table>

        <Button
          onClick={checkIn}
          disabled={customer.qrUsed}
        >
          Check In
        </Button>
      </Card.Body>
    </Card>
  );
};

export default QRResult;