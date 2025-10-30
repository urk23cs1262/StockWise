import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import axiosInstance from "@/api/axiosInstance";
import { useState } from "react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleSendOtp = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/forgot-password", data);
      setMessage(response.data.message || "OTP sent to your email");
      setEmail(data.email);
      setStep(2);
      reset();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp: data.otp,
      });
      const token = response.data.data.resetToken;
      setResetToken(token);
      setMessage("OTP verified successfully!");
      setStep(3);
      reset();
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid OTP. Try again.");
    }
  };

  const handleResetPassword = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/auth/reset-password",
        { password: data.password },
        { headers: { Authorization: `Bearer ${resetToken}` } }
      );
      setMessage(response.data.message || "Password reset successful!");
      setStep(4);
      reset();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
    }
  };

  const password = watch("password");

  return (
    <div className="max-w-md mx-auto mt-20 bg-neutral-900 p-8 rounded-xl shadow-md text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {step === 1 && "Forgot Password"}
        {step === 2 && "Verify OTP"}
        {step === 3 && "Reset Password"}
        {step === 4 && "Success 🎉"}
      </h2>

      {step === 1 && (
        <form onSubmit={handleSubmit(handleSendOtp)} className="space-y-5">
          <InputField
            name="email"
            label="Registered Email"
            placeholder="Enter your email"
            register={register}
            error={errors.email}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            }}
          />
          <Button type="submit" className="w-full bg-yellow-500" disabled={isSubmitting}>
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-5">
          <InputField
            name="otp"
            label="Enter OTP"
            placeholder="Enter 6-digit OTP"
            register={register}
            error={errors.otp}
            validation={{
              required: "OTP is required",
              pattern: {
                value: /^\d{6}$/,
                message: "Enter a valid 6-digit OTP",
              },
            }}
          />
          <Button type="submit" className="w-full bg-yellow-500" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>
          <p
            className="text-sm text-yellow-400 text-center cursor-pointer"
            onClick={() => setStep(1)}
          >
            Resend OTP
          </p>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-5">
          <InputField
            name="password"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            register={register}
            error={errors.password}
            validation={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[A-Za-z\d@#]{6,}$/,
                message:
                  "Password must contain at least one uppercase letter, one number, and one special character (@ or #)",
              },
            }}
          />

          <InputField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter new password"
            register={register}
            error={errors.confirmPassword}
            validation={{
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            }}
          />

          <Button type="submit" className="w-full bg-yellow-500" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      )}

      {step === 4 && (
        <div className="text-center">
          <p className="text-green-400 mb-4">{message}</p>
          <Button className="bg-yellow-500 w-full" onClick={() => (window.location.href = "/auth")}>
            Back to Login
          </Button>
        </div>
      )}

      {message && step !== 4 && (
        <p className="mt-4 text-center text-sm text-gray-400">{message}</p>
      )}
    </div>
  );
};

export default ForgotPassword;

