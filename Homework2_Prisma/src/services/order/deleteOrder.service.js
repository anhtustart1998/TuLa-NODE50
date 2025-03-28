import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.body;

  if (!orderId || isNaN(parseInt(orderId)) || parseInt(orderId) <= 0) {
    throw new BadRequestException("Valid order ID is required");
  }

  if (!userId || isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
    throw new BadRequestException("Valid user ID is required");
  }

  const orderIdInt = parseInt(orderId);
  const userIdInt = parseInt(userId);

  const order = await prisma.order.findFirst({
    where: {
      order_id: orderIdInt,
      is_deleted: false,
    },
  });

  if (!order) {
    throw new NotFoundException("Order not found or already deleted");
  }

  const deletedOrder = await prisma.order.update({
    where: { order_id: orderIdInt },
    data: {
      is_deleted: true,
      deleted_by: userIdInt,
      deleted_at: new Date(),
    },
  });

  return deletedOrder;
};
