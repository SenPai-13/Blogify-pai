import { Routes } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import { useUserLoader } from "../hooks/useUserLoader";
import GlobalLoader from "../components/common/GloabalLoader";
import ProtectedRoutes from "./ProtectedRoutes";

const AppRoutes = () => {
  const { showLoader } = useUserLoader();

  if (showLoader) return <GlobalLoader />;

  return (
    <Routes>
      {PublicRoutes()}
      {ProtectedRoutes()}
    </Routes>
  );
};

export default AppRoutes;
