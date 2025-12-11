import React from "react";
import logo from "../../assets/Blog.png";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.userAuth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-black px-6 py-4 flex items-center justify-between">
      {/* Logo on the left */}
      <img src={logo} alt="Blogify Logo" className="h-10 w-auto" />

      {/* Logout icon on the right (only if signed in) */}
      {user && (
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center p-2 rounded-md text-white hover:text-red-400 transition cursor-pointer focus:outline-none"
          title="Logout">
          <FiLogOut size={22} />
        </button>
      )}
    </nav>
  );
};

export default Navbar;
