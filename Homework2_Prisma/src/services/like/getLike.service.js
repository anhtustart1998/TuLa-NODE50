import {
  BadRequestException,
  NotFoundException,
} from "../../common/helper/exception.helper.js";
import { prisma } from "../../config/prisma/config.prisma.js";

export const getLikesByUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new BadRequestException("User Id is required!");
  }

  if (isNaN(parseInt(userId)) || parseInt(userId) <= 0) {
    throw new BadRequestException("Valid User ID is required!");
  }
  const likes = await prisma.like_res.findMany({
    where: {
      user_id: parseInt(userId),
      is_deleted: false,
    },
    include: {
      restaurant: {
        select: {
          res_id: true,
          res_name: true,
          image: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!likes || likes.length === 0) {
    throw new NotFoundException("Likes not found for this user");
  }

  return likes;
};

export const getLikesByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  if (!restaurantId) {
    throw new BadRequestException("Restaurant ID is required!");
  }

  if (isNaN(parseInt(restaurantId)) || parseInt(restaurantId) <= 0) {
    throw new BadRequestException("Valid restaurant ID is required!");
  }
  const likes = await prisma.like_res.findMany({
    where: {
      res_id: parseInt(restaurantId),
      is_deleted: false,
    },
    include: {
      user: {
        select: {
          user_id: true,
          full_name: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!likes || likes.length === 0) {
    throw new NotFoundException("Likes not found for this restaurant");
  }
  return likes;
};
