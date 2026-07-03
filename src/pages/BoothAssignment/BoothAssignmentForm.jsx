import { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";

const statusOptions = [
  "Waiting",
  "Assigned",
  "In Discussion",
  "Completed",
  "Cancelled",
];

const BoothAssignmentForm = ({ assignment, onSuccess }) => {
  const [customers, setCustomers] = useState([]);
  const [booths, setBooths] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      customerId: "",
      boothNumber: "",
      salesManager: "",
      status: "Assigned",
    },
  });

  //---------------------------------------
  // Load Customers + Booths
  //---------------------------------------

  const loadData = async () => {
    try {
      const customerResponse = await apiService.get(
        apiPath.CUSTOMERS
      );

      const boothResponse = await apiService.get(
        apiPath.BOOTH_ASSIGNMENTS
      );

      //---------------------------------------
      // Checked-In Customers
      //---------------------------------------

      const availableCustomers =
        customerResponse.filter(
          (customer) =>
            customer.eventStatus === "Checked-In" ||
            customer.id === assignment?.customerId
        );

      //---------------------------------------
      // Available Booths
      //---------------------------------------

      const assignedBooths = boothResponse
        .filter(
          (booth) =>
            booth.customerId &&
            booth.id !== assignment?.id
        )
        .map((booth) => booth.boothNumber);

      const boothList = [
        "B1",
        "B2",
        "B3",
        "B4",
        "B5",
        "B6",
      ];

      const availableBooths = boothList.filter(
        (booth) =>
          !assignedBooths.includes(booth) ||
          booth === assignment?.boothNumber
      );

      setCustomers(availableCustomers);

      setBooths(availableBooths);
    } catch (error) {
      toast.error("Unable to load data");
    }
  };

  //---------------------------------------

  useEffect(() => {
    loadData();
  }, []);

  //---------------------------------------

  useEffect(() => {
    if (assignment) {
      reset({
        customerId: assignment.customerId,
        boothNumber: assignment.boothNumber,
        salesManager: assignment.salesManager,
        status: assignment.status,
      });
    } else {
      reset({
        customerId: "",
        boothNumber: "",
        salesManager: "",
        status: "Assigned",
      });
    }
  }, [assignment, reset]);

  //---------------------------------------
  // Save
  //---------------------------------------

  const onSubmit = async (data) => {
    try {
      const customer = customers.find(
        (item) =>
          item.id === Number(data.customerId)
      );

      const payload = {
        ...data,
        customerId: Number(data.customerId),
        customerName: customer?.name,
      };

      if (assignment?.id) {
        await apiService.put(
          apiPath.BOOTH_ASSIGNMENT_BY_ID(
            assignment.id
          ),
          payload
        );

        toast.success(
          "Assignment Updated"
        );
      } else {
        await apiService.post(
          apiPath.BOOTH_ASSIGNMENTS,
          payload
        );

        toast.success(
          "Booth Assigned Successfully"
        );
      }

      onSuccess?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  //---------------------------------------

  return (
    <Form
      id="booth-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              Customer
            </Form.Label>

            <Form.Select
              {...register(
                "customerId",
                {
                  required:
                    "Customer is required",
                }
              )}
            >
              <option value="">
                Select Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                >
                  {customer.name}
                </option>
              ))}
            </Form.Select>

            <small className="text-danger">
              {
                errors.customerId
                  ?.message
              }
            </small>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Booth
            </Form.Label>

            <Form.Select
              {...register(
                "boothNumber",
                {
                  required:
                    "Booth is required",
                }
              )}
            >
              <option value="">
                Select Booth
              </option>

              {booths.map((booth) => (
                <option
                  key={booth}
                  value={booth}
                >
                  {booth}
                </option>
              ))}
            </Form.Select>

            <small className="text-danger">
              {
                errors.boothNumber
                  ?.message
              }
            </small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Sales Manager
            </Form.Label>

            <Form.Control
              placeholder="Enter Sales Manager"
              {...register(
                "salesManager",
                {
                  required:
                    "Sales Manager is required",
                }
              )}
            />

            <small className="text-danger">
              {
                errors.salesManager
                  ?.message
              }
            </small>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              Status
            </Form.Label>

            <Form.Select
              {...register("status")}
            >
              {statusOptions.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="text-end">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : assignment
            ? "Update Assignment"
            : "Assign Booth"}
        </Button>
      </div>
    </Form>
  );
};

export default BoothAssignmentForm;