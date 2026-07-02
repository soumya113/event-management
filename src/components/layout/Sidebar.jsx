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

        <NavLink to="/qr">

          <FaQrcode /> QR Scan

        </NavLink>

        <NavLink to="/booth">

          <FaBuilding /> Booth

        </NavLink>

        <NavLink to="/status">

          <FaTasks /> Status

        </NavLink>

      </Nav>

    </div>
  );
};

export default Sidebar;