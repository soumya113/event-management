import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { apiPath } from "./config/ApiPath";
import apiService from "./api/apiService";
import AppRoutes from "./routes/AppRoutes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <AppRoutes />;
      <ToastContainer
        position="top-right"
        autoClose={3000}
        // theme="colored"
      />
    </>
  );
}

export default App;
