import { Card, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import apiService from "../../api/apiService";
import { apiPath } from "../../config/ApiPath";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const response = await apiService.post(apiPath.LOGIN, data);

    localStorage.setItem("token", response.token);

    navigate("/");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card style={{ width: 400 }} className="p-4">
        <h3 className="mb-4 text-center">Login</h3>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>

            <Form.Control
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email Required",
              })}
            />

            <p className="text-danger">{errors.email?.message}</p>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>

            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password Required",
              })}
            />

            <p className="text-danger">{errors.password?.message}</p>
          </Form.Group>

          <Button type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
