import {
  BadRequestException,
  NotFoundException,
} from "../common/helper/exception.helper.js";
import { prisma } from "../config/prisma/config.prisma.js";

export const rateService = {
  // Create Rate Service
  createRate: async (req, res) => {
    const { userId, restaurantId, rateScore, commentMessage } = req.body;
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

    const restaurantExists = await prisma.restaurant.findUnique({
      where: {
        res_id: parseInt(restaurantId),
      },
    });

    const userExists = await prisma.user.findUnique({
      where: {
        user_id: parseInt(userId),
      },
    });

    if (!userExists) {
      throw new NotFoundException("User not found");
    }

    if (!restaurantExists) {
      throw new NotFoundException("Restaurant not found");
    }

    const rateScoreNum = Number(rateScore);
    if (isNaN(rateScoreNum) || rateScoreNum <= 0 || rateScoreNum > 5) {
      throw new BadRequestException("Rate score must be between 1 and 5");
    }

    const existingRate = await prisma.rate_res.findUnique({
      where: {
        user_id_res_id: {
          user_id: parseInt(userId),
          res_id: parseInt(restaurantId),
        },
      },
    });

    if (existingRate) {
      if (existingRate.is_deleted) {
        const restoredRate = await prisma.rate_res.update({
          where: {
            rate_id: existingRate.rate_id,
          },
          data: {
            is_deleted: false,
            deleted_by: 0,
            deleted_at: null,
            amount: rateScoreNum,
            comment: commentMessage,
          },
        });
        return {
          type: "restored",
          data: restoredRate,
        };
      } else {
        const updatedRate = await prisma.rate_res.update({
          where: {
            rate_id: existingRate.rate_id,
          },
          data: {
            amount: rateScoreNum,
            comment: commentMessage,
          },
        });
        return {
          type: "updated",
          data: updatedRate,
        };
      }
    }

    const newRate = await prisma.rate_res.create({
      data: {
        user_id: parseInt(userId),
        res_id: parseInt(restaurantId),
        amount: rateScoreNum,
        comment: commentMessage,
      },
    });
    return {
      type: "created",
      data: newRate,
    };
  },

  removeRate: async (req, res) => {
    const { userId, restaurantId } = req.body;

    const userIdInt = parseInt(userId);
    const restaurantIdInt = parseInt(restaurantId);

    if (!userIdInt || isNaN(userIdInt) || userIdInt <= 0) {
      throw new BadRequestException("Valid user ID is required");
    }

    if (!restaurantIdInt || isNaN(restaurantIdInt) || restaurantIdInt <= 0) {
      throw new BadRequestException("Valid restaurant ID is required");
    }

    // Check user exist or not
    const userExists = await prisma.user.findUnique({
      where: {
        user_id: userIdInt,
      },
    });

    if (!userExists) {
      throw new NotFoundException("User not found");
    }

    // Check restaurant exist or not
    const restaurantExists = await prisma.restaurant.findUnique({
      where: {
        res_id: restaurantIdInt,
      },
    });

    if (!restaurantExists) {
      throw new NotFoundException("Restaurant not found");
    }

    const rate = await prisma.rate_res.findFirst({
      where: {
        user_id: userIdInt,
        res_id: restaurantIdInt,
        is_deleted: false,
      },
    });
    if (!rate) {
      throw new NotFoundException("Rate not found or already removed.");
    }

    const deletedRate = await prisma.rate_res.update({
      where: {
        rate_id: rate.rate_id,
      },
      data: {
        is_deleted: true,
        deleted_by: userIdInt,
        deleted_at: new Date(),
      },
    });
    return deletedRate;
  },

  getRatesByUser: async (req, res) => {
    const { userId } = req.params;

    const userIdInt = parseInt(userId);

    if (!userIdInt || isNaN(userIdInt) || userIdInt <= 0) {
      throw new BadRequestException("Valid user ID is required");
    }

    // Check user exist or not
    const userExists = await prisma.user.findUnique({
      where: {
        user_id: userIdInt,
      },
    });

    if (!userExists) {
      throw new NotFoundException("User not found");
    }

    const rates = await prisma.rate_res.findMany({
      where: {
        user_id: userIdInt,
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

    if (!rates || rates.length === 0) {
      throw new NotFoundException("Rates not found for this user.");
    }

    return rates;
  },

  getRatesByRestaurant: async (req, res) => {
    const { restaurantId } = req.params;

    const restaurantIdInt = parseInt(restaurantId);

    if (!restaurantIdInt || isNaN(restaurantIdInt) || restaurantIdInt <= 0) {
      throw new BadRequestException("Valid restaurant ID is required");
    }

    // Check restaurant exist or not
    const restaurantExists = await prisma.restaurant.findUnique({
      where: {
        res_id: restaurantIdInt,
      },
    });

    if (!restaurantExists) {
      throw new NotFoundException("Restaurant not found");
    }

    const rates = await prisma.rate_res.findMany({
      where: {
        res_id: restaurantIdInt,
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

    if (!rates || rates.length === 0) {
      throw new NotFoundException("Rates not found for this restaurant!");
    }
    return rates;
  },
};
