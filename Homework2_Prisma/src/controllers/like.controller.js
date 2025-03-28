import {
  responseError,
  responseSuccess,
} from "../common/helper/response.helper.js";
import {
  getLikesByUser,
  getLikesByRestaurant,
} from "../services/like/getLike.service.js";
import { createLike } from "../services/like/createLike.service.js";
import { deleteLike } from "../services/like/deleteLike.service.js";

// Create a new like Controller
// Note: A Customer cannot like a restaurant more than once
export const createLikeController = async (req, res, next) => {
  try {
    const result = await createLike(req, res);

    if (result.type === "restored") {
      const response = responseSuccess(
        result.data,
        "Like restored successfully!",
        200
      );
      res.status(response.statusCode).json(response);
    } else {
      const response = responseSuccess(
        result.data,
        "Like created successfully!",
        201
      );
      res.status(response.statusCode).json(response);
    }
  } catch (error) {
    next(error);
  }
};

// Delete a like Controller
export const unlikeController = async (req, res, next) => {
  try {
    const result = await deleteLike(req, res);

    const response = responseSuccess(result, "Like deleted successfully!", 200);

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Get all likes by user Controller (Prisma)
export const getLikesByUserController = async (req, res, next) => {
  try {
    const result = await getLikesByUser(req, res);

    const response = responseSuccess(
      result,
      "Likes by User fetched successfully",
      200
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Get all likes by restaurant Controller
export const getLikesByRestaurantController = async (req, res, next) => {
  try {
    const result = await getLikesByRestaurant(req, res);

    const response = responseSuccess(
      result,
      "Likes by Restaurant fetched successfully",
      200
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
