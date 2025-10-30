import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import { useForm } from "react-hook-form";
import axiosInstance from "@/api/axiosInstance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddUserDialog = ({ open, onClose, refresh }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/admin/users", data);
      setMessage("✅ User added successfully!");
      refresh();
      setTimeout(() => {
        onClose();
        reset();
        setMessage("");
      }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to add user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900 text-white border border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <InputField
            name="username"
            label="Username"
            placeholder="Enter full name"
            register={register}
            error={errors.username}
            validation={{ required: "Username is required" }}
          />

          {/* Email */}
          <InputField
            name="email"
            label="Email"
            placeholder="user@example.com"
            register={register}
            error={errors.email}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            }}
          />

          {/* Password */}
          <InputField
            name="password"
            label="Password"
            placeholder="Enter password"
            type="password"
            register={register}
            error={errors.password}
            validation={{
              required: "Password is required",
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@#])[A-Za-z\d@#]{6,}$/,
                message:
                  "Password must contain at least one uppercase letter, one number, and one special character (@ or #)",
              },
            }}
          />

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select
              onValueChange={(val) => setValue("role", val)}
              defaultValue={watch("role") || "user"}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="bg-yellow-500 hover:bg-yellow-400 w-full">
              {isSubmitting ? "Adding..." : "Add User"}
            </Button>
          </DialogFooter>

          {message && <p className="text-center text-sm text-gray-400">{message}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
