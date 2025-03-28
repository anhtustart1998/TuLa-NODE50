import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  const orderIdInt = parseInt(orderId);

  if (!orderIdInt || isNaN(orderIdInt) || orderIdInt <= 0) {
    throw new BadRequestException("Valid order ID is required");
  }

  // Check if order exists
  const orderExists = await prisma.order.findUnique({
    where: { order_id: orderIdInt },
  });

  if (!orderExists) {
    throw new NotFoundException("Order not found");
  }

  const order = await prisma.order.findFirst({
    where: {
      order_id: orderIdInt,
      is_deleted: false,
    },
    select: {
      order_id: true,
      code: true,
      user_id: true,
      amount: true,
      status: true,
      created_at: true,
      updated_at: true,
      food: {
        select: {
          food_id: true,
          food_name: true,
          price: true,
        },
      },
      order_sub_food: {
        select: {
          sub_food: {
            select: {
              sub_id: true,
              sub_name: true,
              sub_price: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundException("Order not found");
  }

  const formattedOrder = {
    order_id: order.order_id,
    code: order.code,
    user_id: order.user_id,
    amount: order.amount,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
    food: order.food,
    sub_foods: order.order_sub_food.map((osf) => osf.sub_food),
  };

  return formattedOrder;
};
