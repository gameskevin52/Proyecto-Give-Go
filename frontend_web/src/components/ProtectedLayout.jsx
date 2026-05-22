import { useNavigate } from "react-router-dom";
import { handleLogout } from "../controllers/authController";

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div>
      <nav style={{ background: "#ff0000", padding: "10px", color: "#fff" }}>
        <h2>Give&Go Admin</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </nav>

      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default ProtectedLayout;