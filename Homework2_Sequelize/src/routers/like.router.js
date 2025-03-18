import express from "express";
import {
  createLikeController,
  getLikesByRestaurantController,
  getLikesByUserController,
  unlikeController,
} from "../controllers/like.controller.js";

const likeRouter = express.Router();

likeRouter.post("/create-like", createLikeController);
likeRouter.delete("/delete-like", unlikeController);
likeRouter.get("/user/:userId", getLikesByUserController);
likeRouter.get("/restaurant/:restaurantId", getLikesByRestaurantController);

export default likeRouter;
