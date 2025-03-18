import { models } from "../config/sequelize/connect.sequelize.js";

// Create a new like Controller
// Note: A Customer cannot like a restaurant more than once
export const createLikeController = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;

    const existingLike = await models.like_res.findOne({
      where: { user_id: userId, res_id: restaurantId },
    });

    if (existingLike) {
      if (existingLike.is_deleted) {
        await existingLike.update({
          is_deleted: false,
          deleted_by: 0,
          deleted_at: null,
        });
        return res
          .status(200)
          .json({ message: "Like restored successfully!", like: existingLike });
      }
      res
        .status(400)
        .json({ message: "User has already liked this restaurant" });
    }
    const like = await models.like_res.create({
      user_id: userId,
      res_id: restaurantId,
    });

    res.status(201).json(like);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating like", error: error.message });
  }
};

// Delete a like Controller
// Note: Sequelize has built-in soft delete if table has deleted_at column and paranoid set to true
export const unlikeController = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;

    const like = await models.like_res.findOne({
      where: { user_id: userId, res_id: restaurantId, is_deleted: false },
    });

    if (!like) {
      res.status(400).json({ message: "Like not found or already removed." });
    }

    await like.update({
      is_deleted: true,
      deleted_by: userId,
      // Note: if paranoid is set "true", sequelize will auto handel deleted_at, blocking manual update (but only with destroy method in sequelize). Change paranoid to "false".
      deleted_at: new Date(),
    });

    res.status(200).json({ message: "Like deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting like", error: error.message });
  }
};

// Get all likes by user Controller
export const getLikesByUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const likes = await models.like_res.findAll({
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
      order: [["createdAt", "DESC"]],
    });

    if (!likes || likes.length === 0) {
      return res.status(404).json({ message: "Likes not found for this user" });
    }
    res.status(200).json(likes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting likes by user", error: error.message });
  }
};

// Get all likes by restaurant Controller
export const getLikesByRestaurantController = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const likes = await models.like_res.findAll({
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
      order: [["createdAt", "DESC"]],
    });

    if (!likes || likes.length === 0) {
      return res
        .status(404)
        .json({ message: "Likes not found for this restaurant" });
    }

    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({
      message: "Error getting likes by restaurant",
      error: error.message,
    });
  }
};
