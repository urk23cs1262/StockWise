import express from "express"
import { PORT, DB_URI } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import stockRouter from "./routes/stock.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleWare from "./middleware/error.middleware.js";
import watchlistRouter from "./routes/watchlist.routes.js";
import adminRouter from "./routes/admin.routes.js";
import cors from "cors";

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://stock-wise-urk23cs1262s-projects.vercel.app/'],
  credentials: true
}));
app.use(express.json())

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/stocks", stockRouter);
app.use("/api/v1/watchlist", watchlistRouter);
app.use("/api/v1/admin", adminRouter);



app.use(errorMiddleWare);

app.listen(PORT, async() => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectToDatabase();
})


export default app;
