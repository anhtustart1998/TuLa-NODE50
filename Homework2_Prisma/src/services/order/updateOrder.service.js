import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!orderId || isNaN(parseInt(orderId)) || parseInt(orderId) <= 0) {
    throw new BadRequestException("Valid order ID is required");
  }

  // Validate status
  const validStatuses = ["pending", "completed", "canceled", "failed"];
  if (!status || !validStatuses.includes(status)) {
    throw new BadRequestException("Invalid status");
  }

  const orderIdInt = parseInt(orderId);

  // Check if order exists
  const order = await prisma.order.findFirst({
    where: {
      order_id: orderIdInt,
      is_deleted: false,
    },
  });

  if (!order) {
    throw new NotFoundException("Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: { order_id: orderIdInt },
    data: { status },
    select: {
      order_id: true,
      code: true,
      user_id: true,
      status: true,
      updated_at: true,
    },
  });

  return updatedOrder;
};
