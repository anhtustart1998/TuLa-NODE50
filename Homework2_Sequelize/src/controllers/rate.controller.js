import { models } from "../config/sequelize/connect.sequelize.js";

// Create a new rate Controller
export const createRateController = async (req, res) => {
  try {
    const { userId, restaurantId, rateScore, commentMessage } = req.body;
    const existingRate = await models.rate_res.findOne({
      where: { user_id: userId, res_id: restaurantId },
    });

    if (existingRate) {
      if (existingRate.is_deleted) {
        await existingRate.update({
          is_deleted: false,
          deleted_by: 0,
          deleted_at: null,
          amount: rateScore,
          comment: commentMessage,
        });
        return res.status(200).json({
          message: "Rate restored & updated successfully!",
          rate: existingRate,
        });
      } else {
        await existingRate.update({
          amount: rateScore,
          comment: commentMessage,
        });
        return res.status(200).json({
          message: "Rate updated successfully!",
          rate: existingRate,
        });
      }
    }

    const rate = await models.rate_res.create({
      user_id: userId,
      res_id: restaurantId,
      amount: rateScore,
      comment: commentMessage,
    });
    res.status(201).json(rate);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating rate", error: error.message });
  }
};

// Remove a rate Controller
export const removeRateController = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;

    const rate = await models.rate_res.findOne({
      where: { user_id: userId, res_id: restaurantId, is_deleted: false },
    });

    if (!rate) {
      res.status(400).json({ message: "Rate not found or already removed." });
    }

    await rate.update({
      is_deleted: true,
      deleted_by: userId,
      deleted_at: new Date(),
    });

    res.status(200).json({ message: "Rate deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing rate", error: error.message });
  }
};

// Get all rates by user Controller
export const getRatesByUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const rates = await models.rate_res.findAll({
      where: {
        user_id: userId,
        is_deleted: false,
      },
      include: [
        {
          model: models.restaurant,
          as: "re",
          attributes: ["res_id", "res_name", "image"],
        },
      ],
      order: [["created_at", "DESC"]],
    });
    if (!rates || rates.length === 0) {
      return res
        .status(404)
        .json({ message: "Rates not found for this user." });
    }
    res.status(200).json(rates);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting rates by user", error: error.message });
  }
};

// Get all rates by restaurant Controller
export const getRatesByRestaurantController = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const rates = await models.rate_res.findAll({
      where: {
        res_id: restaurantId,
        is_deleted: false,
      },
      include: [
        {
          model: models.user,
          as: "user",
          attributes: ["user_id", "full_name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (!rates || rates.length === 0) {
      return res
        .status(404)
        .json({ message: "Rates not found for this restaurant" });
    }

    res.status(200).json(rates);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error getting rates by restaurant",
        error: error.messsage,
      });
  }
};
