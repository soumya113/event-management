import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

const AppNavbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (
    <Navbar bg="white" className="shadow-sm">

      <Container fluid>

        <Navbar.Brand>

          Event Dashboard

        </Navbar.Brand>

        <Nav>

          <Button
            variant="danger"
            onClick={handleLogout}
          >
            Logout
          </Button>

        </Nav>

      </Container>

    </Navbar>
  );
};

export default AppNavbar;