import { useEffect, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import {
  FaUsers,
  FaUserCheck,
  FaClock,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";

import SummaryCard from "../../components/dashboard/SummaryCard";
import StatusChart from "../../components/charts/StatusChart";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const getDashboard = async () => {
    try {
      setLoading(true);

      const response = await apiService.get(
        apiPath.DASHBOARD_SUMMARY
      );

      setSummary(response);
    } catch (err) {
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">

        <Spinner animation="border" />

      </div>
    );

  if (error)
    return (
      <Alert variant="danger">

        {error}

      </Alert>
    );

  return (
    <>
      <h3 className="mb-4">

        Dashboard

      </h3>

      <Row className="g-4">

        <Col md={6} lg={3}>
          <SummaryCard
            title="Total Customers"
            value={summary.totalCustomers}
            bg="primary"
            icon={<FaUsers />}
          />
        </Col>

        <Col md={6} lg={3}>
          <SummaryCard
            title="Checked-In"
            value={summary.checkedInCustomers}
            bg="success"
            icon={<FaUserCheck />}
          />
        </Col>

        <Col md={6} lg={3}>
          <SummaryCard
            title="Waiting"
            value={summary.waitingCustomers}
            bg="warning"
            icon={<FaClock />}
          />
        </Col>

        <Col md={6} lg={3}>
          <SummaryCard
            title="Assigned"
            value={summary.assignedCustomers}
            bg="info"
            icon={<FaBuilding />}
          />
        </Col>

        <Col md={6} lg={3}>
          <SummaryCard
            title="Completed"
            value={summary.completedCustomers}
            bg="dark"
            icon={<FaCheckCircle />}
          />
        </Col>

      </Row>

      <Card className="mt-5 shadow-sm">

        <Card.Header>

          Customer Status Distribution

        </Card.Header>

        <Card.Body>

          <StatusChart summary={summary} />

        </Card.Body>

      </Card>
    </>
  );
};

export default Dashboard;