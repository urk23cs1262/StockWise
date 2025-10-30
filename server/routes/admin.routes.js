import express from "express";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  getStats,
} from "../controllers/admin.controller.js";
import { authorize, authorizeAdmin } from "../middleware/auth.middleware.js";

const adminRouter = express.Router();

// Protect all admin routes
adminRouter.use(authorize, authorizeAdmin);

adminRouter.get("/users", getAllUsers);
adminRouter.post("/users", addUser);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);
adminRouter.get("/stats", getStats);

export default adminRouter;