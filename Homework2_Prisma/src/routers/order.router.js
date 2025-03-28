import express from "express";
import {
  createOrderController,
  deleteOrderController,
  getOrderByUserController,
  getOrderDetailsController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";
import { or } from "sequelize";

const orderRouter = express.Router();

orderRouter.post("/create-order", createOrderController);
orderRouter.get("/user/:userId?", getOrderByUserController);
orderRouter.get("/:orderId?", getOrderDetailsController);
orderRouter.put("/:orderId?", updateOrderStatusController);
orderRouter.delete("/:orderId?", deleteOrderController);

export default orderRouter;
