import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const createOrder = async (req, res) => {
  const { userId, foodId, subIds, amount = 1 } = req.body;

  const userIdInt = parseInt(userId);
  const foodIdInt = parseInt(foodId);
  const amountInt = parseInt(amount) || 1;

  if (!userIdInt || isNaN(userIdInt) || userIdInt <= 0) {
    throw new BadRequestException("Valid user ID is required");
  }

  if (!foodIdInt || isNaN(foodIdInt) || foodIdInt <= 0) {
    throw new BadRequestException("Valid food ID is required");
  }

  // Check if food exists
  const foodExists = await prisma.food.findUnique({
    where: { food_id: foodIdInt },
  });

  if (!foodExists) {
    throw new NotFoundException("Food not found");
  }

  // Check if user exists
  const userExists = await prisma.food.findUnique({
    where: { food_id: userIdInt },
  });

  if (!userExists) {
    throw new NotFoundException("User not found");
  }

  const order = await prisma.order.create({
    data: {
      user_id: userIdInt,
      food_id: foodIdInt,
      amount: amountInt,
      status: "pending",
    },
  });

  //   Generate Order Code
  const orderCode = `ORDER${String(order.order_id).padStart(10, "0")}`;

  await prisma.order.update({
    where: {
      order_id: order.order_id,
    },
    data: {
      code: orderCode,
    },
  });

  const subIdsArray = Array.isArray(subIds) ? subIds : subIds ? [subIds] : [];

  if (subIdsArray.length > 0) {
    const orderSubFoodData = subIdsArray.map((subId) => ({
      order_id: order.order_id,
      sub_id: parseInt(subId),
    }));

    await prisma.order_sub_food.createMany({
      data: orderSubFoodData,
    });
  }

  const updatedOrder = await prisma.order.findUnique({
    where: { order_id: order.order_id },
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
          order_sub_food_id: true,
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

  return updatedOrder;
};
