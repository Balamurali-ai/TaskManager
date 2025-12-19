import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../../services/authService";

const Topbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="h-16 bg-white shadow-sm border-b flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.name || "User"}!
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/profile" className="flex items-center">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Topbar;