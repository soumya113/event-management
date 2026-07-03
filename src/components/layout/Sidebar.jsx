import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaQrcode,
  FaBuilding,
  FaTasks,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">

      <h4 className="text-center mb-4">

        EVENT

      </h4>

      <Nav className="flex-column">

        <NavLink to="/" end>

          <FaChartBar /> Dashboard

        </NavLink>

        <NavLink to="/customers">

          <FaUsers /> Customers

        </NavLink>

        <NavLink to="/qr-scanner">

          <FaQrcode /> QR Scan

        </NavLink>

        <NavLink to="/booth-assignment">

          <FaBuilding /> Booth

        </NavLink>

      </Nav>

    </div>
  );
};

export default Sidebar;