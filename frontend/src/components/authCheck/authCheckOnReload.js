import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/check-auth", { withCredentials: true });
        // User is authenticated
      } catch (error) {
        // User is not authenticated or token expired
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);
};

export default useAuthCheck;
