import Sidebar from "./components/SideBar";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import DashboardView from "./views/DashboardView";
import ProductsView from "./views/ProductsView";
import ProfileView from "./views/ProfileView";
import UsersView from "./views/UsersView";
import { useEffect, useState } from "react";
import { StockManagmentView } from "./views/StockManagmentView";
import InvoicesView from "./views/InvoicesView";
import { ToastContainer } from "react-toastify";

export default function App() {
  const [currentView, setCurrentView] = useState(
    localStorage.getItem("currentView") || "Login"
  );
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    } else {
      setCurrentView("Login");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case "Login":
        return (
          <LoginView setToken={setToken} setCurrentView={setCurrentView} />
        );
      case "Register":
        return (
          <RegisterView setToken={setToken} setCurrentView={setCurrentView} />
        );
      case "Home":
        return <DashboardView />;
      case "Products":
        return <ProductsView />;
      case "Stocks":
        return <StockManagmentView />;
      case "Profile":
        return <ProfileView />;
      case "Users":
        return <UsersView />;
      case "Invoices":
        return <InvoicesView />;
      default:
        return <p>View not found.</p>;
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        setToken={setToken}
        token={token}
      />
      <main className="w-full h-full justify-center overflow-scroll bg-[f3f4f6]">
        {renderView()}
      </main>
      <ToastContainer />
    </div>
  );
}
