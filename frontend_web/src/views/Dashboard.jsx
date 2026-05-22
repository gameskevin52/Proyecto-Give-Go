import ProtectedLayout from "../components/ProtectedLayout";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <ProtectedLayout>
      <h1>Panel de Administración</h1>

      <div className="cards">
        <div className="card">Usuarios</div>
        <div className="card">Pedidos</div>
        <div className="card">Reportes</div>
      </div>
    </ProtectedLayout>
  );
};

export default Dashboard;