import { Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";

const PublicRoutes = () => {
  return (
    <Route>
      <Route path="/login" element={<AuthPage />} />
    </Route>
  );
};

export default PublicRoutes;
