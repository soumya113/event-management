import { useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";
import {
  generateQrCode,
  generateQrImage,
} from "../../utils/common";

const statusOptions = [
  "Waiting",
  "Checked-In",
  "Assigned",
  "In Discussion",
  "Completed",
  "Not Interested",
  "Follow-Up Required",
];

const CustomerForm = ({ customer, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      projectName: "",
      qrCode: "",
      eventStatus: "Waiting",
    },
  });

  useEffect(() => {
    if (customer) {
      reset(customer);
    } else {
      reset({
        name: "",
        mobile: "",
        email: "",
        projectName: "",
        qrCode: "",
        eventStatus: "Waiting",
      });
    }
  }, [customer, reset]);

  const onSubmit = async (data) => {
  try {
    let payload = { ...data };

    if (customer?.id) {
      payload = {
        ...payload,
        qrCode: customer.qrCode,
        qrImage: customer.qrImage,
      };

      await apiService.put(
        apiPath.CUSTOMER_BY_ID(customer.id),
        payload
      );

      toast.success("Customer updated successfully");
    } else {
      const qrValue = generateQrCode();

      const qrImage = await generateQrImage(qrValue);

      payload = {
        ...payload,
        qrCode: qrValue,
        qrImage,
        qrUsed: false,
        assignedBooth: null,
      };

      await apiService.post(
        apiPath.CUSTOMERS,
        payload
      );

      toast.success("Customer added successfully");
    }

    onSuccess?.();
  } catch (error) {
    toast.error("Something went wrong");
    console.error(error);
  }
};

  return (
    <Form id="customer-form" onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>

            <Form.Control
              {...register("name", {
                required: "Customer name is required",
              })}
            />

            <small className="text-danger">
              {errors.name?.message}
            </small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>

            <Form.Control
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter valid mobile number",
                },
              })}
            />

            <small className="text-danger">
              {errors.mobile?.message}
            </small>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>

            <Form.Control
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email",
                },
              })}
            />

            <small className="text-danger">
              {errors.email?.message}
            </small>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>

            <Form.Control
              {...register("projectName", {
                required: "Project is required",
              })}
            />

            <small className="text-danger">
              {errors.projectName?.message}
            </small>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>

            <Form.Select
              {...register("eventStatus", {
                required: true,
              })}
            >
              {statusOptions.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
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
            : customer
            ? "Update Customer"
            : "Add Customer"}
        </Button>
      </div>
    </Form>
  );
};

export default CustomerForm;