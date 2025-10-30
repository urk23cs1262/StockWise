import axiosInstance from "@/api/axiosInstance"; 
import { useNavigate } from "react-router-dom";

const useSignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await axiosInstance.delete("/auth/sign-out");
      console.log(response.data);

      localStorage.removeItem("token");

      navigate("/auth"); 
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(
        error.response?.data?.message ||
        "Something went wrong while deleting your account."
      );
    }
  };

  return { handleSignOut };
};

export default useSignOut;
