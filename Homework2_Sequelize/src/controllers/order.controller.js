import { models } from "../config/sequelize/connect.sequelize.js";

// Create a new order Controller
export const createOrderController = async (req, res) => {
  try {
    const { userId, foodId, subIds, amount } = req.body;

    const order = await models.order.create({
      user_id: userId,
      food_id: foodId,
      amount: amount || 1,
      status: "pending",
    });

    const orderCode = `ORDER${String(order.order_id).padStart(10, "0")}`;
    await order.update({ code: orderCode });

    const updatedOrder = await models.order.findOne({
      where: { order_id: order.order_id },
      attributes: [
        "order_id",
        "code",
        "user_id",
        "amount",
        "status",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: models.food,
          as: "food",
          attributes: ["food_id", "food_name", "price"],
        },
        {
          model: models.order_sub_food,
          as: "order_sub_foods",
          include: [
            {
              model: models.sub_food,
              as: "sub",
              attributes: ["sub_id", "sub_name", "sub_price"],
            },
          ],
        },
      ],
    });

    let subFoodsDetails = [];
    const subIdsArray = Array.isArray(subIds) ? subIds : [subIds];

    if (subIdsArray.length > 0) {
      const orderSubFoodEntries = subIdsArray.map((subId) => ({
        order_id: order.order_id,
        sub_id: subId,
      }));
      await models.order_sub_food.bulkCreate(orderSubFoodEntries);

      subFoodsDetails = await models.sub_food.findAll({
        where: { sub_id: subIds },
        attributes: ["sub_id", "sub_name", "sub_price"],
      });
    }

    const formattedOrder = {
      order_created: updatedOrder,
      sub_foods: subFoodsDetails,
    };

    res.status(201).json({
      message: "Order created successfully!",
      order: formattedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

// Get all orders by user Controller
export const getOrderByUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await models.order.findAll({
      where: { user_id: userId },
      include: [
        {
          model: models.food,
          as: "food",
          attributes: ["food_id", "food_name", "price"],
        },
        {
          model: models.order_sub_food,
          as: "order_sub_foods",
          include: [
            {
              model: models.sub_food,
              as: "sub",
              attributes: ["sub_id", "sub_name", "sub_price"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Orders not found for this user" });
    }
    const formattedOrders = orders.map((order) => ({
      order_id: order.order_id,
      code: order.code,
      user_id: order.user_id,
      food: order.food,
      sub_foods: order.order_sub_foods.map((osf) => osf.sub),
      amount: order.amount,
      status: order.status,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting orders by user", error: error.message });
  }
};

// Get order details Controller
export const getOrderDetailsController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await models.order.findOne({
      where: { order_id: orderId, is_deleted: false },
      attributes: [
        "order_id",
        "code",
        "user_id",
        "amount",
        "status",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: models.food,
          as: "food",
          attributes: ["food_id", "food_name", "price"],
        },
        {
          model: models.order_sub_food,
          as: "order_sub_foods",
          include: [
            {
              model: models.sub_food,
              as: "sub",
              attributes: ["sub_id", "sub_name", "sub_price"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const formattedOrder = {
      order_id: order.order_id,
      code: order.code,
      user_id: order.user_id,
      food: order.food,
      sub_foods: order.order_sub_foods.map((osf) => osf.sub),
      amount: order.amount,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving order details",
      error: error.message,
    });
  }
};

// Update order status controller
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "completed", "canceled", "failed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await models.order.findOne({
      where: { order_id: orderId, is_deleted: false },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status });
    const updatedOrder = await models.order.findOne({
      where: { order_id: orderId },
      attributes: ["order_id", "code", "user_id", "status", "updated_at"],
    });

    res.status(200).json({
      message: "Order status updated successfully!",
      order: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

// Delete order controller
export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await models.order.findOne({
      where: { order_id: orderId, is_deleted: false },
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or already deleted" });
    }

    await order.update({
      is_deleted: true,
      deleted_by: userId,
      deleted_at: new Date(),
    });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};
