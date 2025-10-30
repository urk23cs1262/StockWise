import { useForm } from "react-hook-form";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import FooterLink from "@/components/forms/FooterLink";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const SignIn = ({ onSwitch }) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/sign-in", data);
      const { token, user } = response.data.data;

      setUser(user);
      localStorage.setItem("token", token);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.error("Signin error:", error);

      const message =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong during signin.";

      if (message.toLowerCase().includes("user")) {
        setError("email", { type: "server", message });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { type: "server", message });
      } else {
        setError("email", { type: "server", message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-5 space-y-4">
      <InputField
        name="email"
        label="Email"
        placeholder="example@example.com"
        register={register}
        error={errors.email}
        validation={{
          required: "Email is required",
          pattern: {
            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message: "Enter a valid email address",
          },
        }}
      />

      <InputField
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register}
        error={errors.password}
        validation={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
      />

      <div className="text-right text-sm">
        <Link
          to="/forgot-password"
          className="text-gray-500 hover:underline font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full mt-5 submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>

      <FooterLink
        text="Don't have an account?"
        linkText="Sign Up"
        onSwitch={onSwitch}
      />
    </form>
  );
};

export default SignIn;
