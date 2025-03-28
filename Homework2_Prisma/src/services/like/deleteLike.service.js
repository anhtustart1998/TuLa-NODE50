import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const deleteLike = async (req, res) => {
  const { userId, restaurantId } = req.body;

  const like = await prisma.like_res.findFirst({
    where: {
      user_id: userId,
      res_id: restaurantId,
      is_deleted: false,
    },
  });

  if (!like) {
    throw new BadRequestException("Like not found or already removed!");
  }

  const deletedLike = await prisma.like_res.update({
    where: {
      like_id: like.like_id,
    },
    data: {
      is_deleted: true,
      deleted_by: userId,
      deleted_at: new Date(),
    },
  });
  return deletedLike;
};
