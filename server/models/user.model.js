import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      match: [/^[\w.]+$/, "Name can contain only letters, numbers, underscores, and dots"],
      minLength: [3, "Name must be at least 3 characters long"],
      maxLength: [50, "Name must be less than or equal to 50 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
    },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    country: {
      type: String,
      required: [true, "Country is required"],
      default: "US",
    },

    investmentGoals: {
      type: String,
      enum: ["Growth", "Income", "Balanced", "Conservative"],
      default: "Growth",
    },

    riskTolerance: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },

    preferredIndustry: {
      type: String,
      enum: ["Technology", "Finance", "Healthcare", "Energy", "Consumer Goods"],
    },

    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
