import express from "express";
import {
  createRateController,
  getRatesByRestaurantController,
  getRatesByUserController,
  removeRateController,
} from "../controllers/rate.controller.js";
import { getLikesByRestaurantController } from "../controllers/like.controller.js";

const rateRouter = express.Router();

rateRouter.post("/create-rate", createRateController);
rateRouter.delete("/delete-rate", removeRateController);
rateRouter.get("/user/:userId?", getRatesByUserController);
rateRouter.get("/restaurant/:restaurantId?", getRatesByRestaurantController);

export default rateRouter;
