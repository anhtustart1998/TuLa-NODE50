import { responseSuccess } from "../common/helper/response.helper.js";
import { createOrder } from "../services/order/createOrder.service.js";
import { deleteOrder } from "../services/order/deleteOrder.service.js";
import { getOrdersByUser } from "../services/order/getOrderByUser.service.js";
import { getOrderDetails } from "../services/order/getOrderDetails.service.js";
import { updateOrderStatus } from "../services/order/updateOrder.service.js";

// Create a new order Controller
export const createOrderController = async (req, res, next) => {
  try {
    const result = await createOrder(req, res);

    const response = responseSuccess(
      result,
      "Order created successfully!",
      201
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Get all orders by user Controller
export const getOrderByUserController = async (req, res, next) => {
  try {
    const result = await getOrdersByUser(req, res);

    const response = responseSuccess(
      result,
      "Orders by User fetched successfully!",
      200
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Get order details Controller
export const getOrderDetailsController = async (req, res, next) => {
  try {
    const result = await getOrderDetails(req, res);

    const response = responseSuccess(
      result,
      "Order details fetched successfully!",
      200
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Update order status controller
export const updateOrderStatusController = async (req, res, next) => {
  try {
    const result = await updateOrderStatus(req, res);

    const response = responseSuccess(
      result,
      "Order updated successfully!",
      200
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Delete order controller
export const deleteOrderController = async (req, res, next) => {
  try {
    const result = await deleteOrder(req, res);

    const response = responseSuccess(result, "Order deleted successfully", 200);

    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
