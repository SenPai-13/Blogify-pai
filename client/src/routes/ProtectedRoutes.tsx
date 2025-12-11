import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AuthPage from "../pages/AuthPage";

const ProtectedRoutes = () => {
  return (
    <Route>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  );
};

export default ProtectedRoutes;
