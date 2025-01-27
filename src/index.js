import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'font-awesome/css/font-awesome.min.css';

import UserManagement from "./UserManagement";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <UserManagement />
  </StrictMode>
);
