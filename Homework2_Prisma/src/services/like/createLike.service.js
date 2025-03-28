import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const createLike = async (req, res) => {
  const { userId, restaurantId } = req.body;

  if (!userId || isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
    throw new BadRequestException("Valid user ID is required");
  }

  if (
    !restaurantId ||
    isNaN(parseInt(restaurantId)) ||
    parseInt(restaurantId) <= 0
  ) {
    throw new BadRequestException("Valid restaurant ID is required");
  }

  const userIdInt = parseInt(userId);
  const restaurantIdInt = parseInt(restaurantId);

  const existingLike = await prisma.like_res.findUnique({
    where: {
      user_id_res_id: {
        user_id: userIdInt,
        res_id: restaurantIdInt,
      },
    },
  });

  if (existingLike) {
    if (existingLike.is_deleted) {
      const updatedLike = await prisma.like_res.update({
        where: {
          like_id: existingLike.like_id,
        },
        data: {
          is_deleted: false,
          deleted_by: 0,
          deleted_at: null,
        },
      });
      return {
        type: "restored",
        data: updatedLike,
      };
    }

    throw new BadRequestException("User has already liked this restaurant");
  }

  const newLike = await prisma.like_res.create({
    data: {
      user_id: userIdInt,
      res_id: restaurantIdInt,
    },
  });

  return {
    type: "created",
    data: newLike,
  };
};
