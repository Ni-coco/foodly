import { useState } from "react";
import {
  FaHome,
  FaBox,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaAngleLeft,
  FaUsers,
  FaList,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import logo from "../assets/images/logo.png";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  setToken: (token: string | null) => void;
  token: string | null;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  setToken,
  token,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true"
  );

  let role = 0;
  const userString = localStorage.getItem("user");
  if (userString) {
    try {
      const user = JSON.parse(userString);
      role = user.role_id || 1;
    } catch (error) {
      console.error("Erreur lors du parsing du user :", error);
    }
  }

  const publicLinks = [
    {
      label: "Login",
      view: "Login",
      roleRequired: null,
      icon: <FaSignInAlt />,
    },
    {
      label: "Register",
      view: "Register",
      roleRequired: null,
      icon: <FaUserPlus />,
    },
  ];

  const privateLinks = [
    // Role 1 = user, Role 2 = admin
    { label: "Dashboard", view: "Home", roleRequired: 1, icon: <FaHome /> },
    { label: "Produits", view: "Products", roleRequired: 1, icon: <FaBox /> },
    { label: "Stock", view: "Stocks", roleRequired: 2, icon: <FaList /> },
    {
      label: "Factures",
      view: "Invoices",
      roleRequired: 2,
      icon: <FaFileInvoiceDollar />,
    },
    {
      label: "Utilisateurs",
      view: "Users",
      roleRequired: 2,
      icon: <FaUsers />,
    },
    { label: "Profile", view: "Profile", roleRequired: 1, icon: <FaUser /> },
  ];

  const linksToDisplay = token ? privateLinks : publicLinks;

  // Handlers
  const handleNavigate = (view: string) => setCurrentView(view);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentView("Login");
  };
  const toggleSidebar = () => {
    localStorage.setItem("sidebarCollapsed", String(!isCollapsed));
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`
        flex flex-col overflow-hidden
        ${isCollapsed ? "w-16" : "w-64"}
        bg-teal text-white p-4 border-r border-gray-700 shadow-lg
        transition-all duration-300
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={toggleSidebar}
          className={`
            transition-transform 
            ${isCollapsed ? "rotate-180" : ""} hover:bg-mint p-1 rounded
          `}
        >
          <FaAngleLeft size={24} />
        </button>

        {!isCollapsed && (
          <h2 className="text-xl font-bold ml-2">
            <img src={logo} alt="logo" className="w-12 rounded-full" />
          </h2>
        )}
      </div>

      <nav className="flex-1">
        <ul>
          {linksToDisplay
            .filter(
              (link) =>
                link.roleRequired === null || role >= (link.roleRequired ?? 0)
            )
            .map((link) => {
              const isActive = currentView === link.view;
              return (
                <li key={link.view} className="mb-2">
                  <button
                    onClick={() => handleNavigate(link.view)}
                    title={link.label}
                    className={`
                      flex items-center
                      w-full p-2 rounded
                      ${
                        isActive
                          ? "bg-mint text-ice"
                          : "hover:bg-mint hover:text-white"
                      }
                      ${isCollapsed ? "justify-center" : "text-left"}
                    `}
                  >
                    <span
                      className={`
                        ${isCollapsed ? "" : "mr-2"} 
                        flex-shrink-0
                      `}
                    >
                      {link.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="flex-grow">{link.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
        </ul>
      </nav>

      {token && (
        <button
          onClick={handleLogout}
          title="Logout"
          className={`
            mt-4 bg-terracotta p-2 rounded flex items-center
            hover:brightness-110
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <FaSignOutAlt className={isCollapsed ? "" : "mr-2"} />
          {!isCollapsed && "Déconnexion"}
        </button>
      )}
    </aside>
  );
}
