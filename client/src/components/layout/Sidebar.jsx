import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/tasks", label: "Tasks", icon: "📝" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Logo size="md" />
          <h1 className="text-xl font-bold text-teal-600">Task Manager Pro</h1>
        </div>
      </div>

      <nav className="px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-teal-50 text-teal-600 border-r-2 border-teal-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 w-full text-left"
        >
          <span className="text-lg">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
