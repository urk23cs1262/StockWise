import express from "express";
import {
  searchStocksController,
  getNewsController,
  getStocksDetailsController, 
} from "../controllers/stock.controller.js";

const stockRouter = express.Router();

stockRouter.get("/search", searchStocksController);
stockRouter.get("/news", getNewsController);

stockRouter.get("/details/:symbol", getStocksDetailsController);
export default stockRouter;