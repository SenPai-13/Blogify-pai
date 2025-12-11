import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

const ProtectedRoutes = () => {
  return (
    <Route>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  );
};

export default ProtectedRoutes;
