import { Router } from "express";
import { SignUp,SignIn ,SignOut, ForgotPassword, VerifyOTP, ResetPassword } from "../controllers/auth.controller.js";
import authorize from "../middleware/auth.middleware.js";
const authRouter = Router();

authRouter.post("/sign-up", SignUp);
authRouter.post("/sign-in", SignIn);
authRouter.delete("/sign-out",authorize, SignOut);

authRouter.post("/forgot-password", ForgotPassword);
authRouter.post("/verify-otp", VerifyOTP);
authRouter.post("/reset-password", ResetPassword);



export default authRouter;