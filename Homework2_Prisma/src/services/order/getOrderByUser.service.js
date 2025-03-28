import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  const userIdInt = parseInt(userId);

  if (!userIdInt || isNaN(userIdInt) || userIdInt <= 0) {
    throw new BadRequestException("Valid user ID is required");
  }

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { user_id: userIdInt },
  });

  if (!userExists) {
    throw new NotFoundException("User not found");
  }

  const orders = await prisma.order.findMany({
    where: {
      user_id: userIdInt,
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
    orderBy: {
      created_at: "desc",
    },
  });

  if (!orders || orders.length === 0) {
    throw new NotFoundException("Order not found for this user!");
  }

  const formattedOrders = orders.map((order) => ({
    order_id: order.order_id,
    code: order.code,
    user_id: order.user_id,
    food: order.food,
    sub_foods: order.order_sub_food.map((osf) => osf.sub_food),
    amount: order.amount,
    status: order.status,
    created_at: order.created_at,
    updated_at: order.updated_at,
  }));

  return formattedOrders;
};
