import { Container } from "react-bootstrap";
import Sidebar from "./Sidebar";
import AppNavbar from "./AppNavbar";

const Layout = ({ children }) => {
  return (
    <div className="d-flex">

      <Sidebar />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: "250px",
          minHeight: "100vh",
          background: "#f4f6f9",
        }}
      >
        <AppNavbar />

        <Container fluid className="p-4">

          {children}

        </Container>
      </div>
    </div>
  );
};

export default Layout;