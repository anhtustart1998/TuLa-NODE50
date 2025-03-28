import { responseSuccess } from "../common/helper/response.helper.js";
import { models } from "../config/sequelize/connect.sequelize.js";
import { rateService } from "../services/rate.service.js";

// Create a new rate Controller
export const createRateController = async (req, res, next) => {
  try {
    const result = await rateService.createRate(req, res);

    if (result.type === "restored") {
      const response = responseSuccess(
        result.data,
        "Rate restored successfully!",
        200
      );
      res.status(response.statusCode).json(response);
    } else if (result.type === "updated") {
      const response = responseSuccess(
        result.data,
        "Rate updated successfully!",
        200
      );
      res.status(response.statusCode).json(response);
    } else {
      const response = responseSuccess(
        result.data,
        "Rate created successfully!",
        201
      );
      res.status(response.statusCode).json(response);
    }
  } catch (error) {
    next(error);
  }
};

// Remove a rate Controller
export const removeRateController = async (req, res, next) => {
  try {
    const result = await rateService.removeRate(req, res);

    const response = responseSuccess(result, "Rate deleted successfully!", 200);

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Get all rates by user Controller
export const getRatesByUserController = async (req, res, next) => {
  try {
    const result = await rateService.getRatesByUser(req, res);

    const response = responseSuccess(
      result,
      "Rate by User fetched successfully!",
      200
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

// Get all rates by restaurant Controller
export const getRatesByRestaurantController = async (req, res, next) => {
  try {
    const result = await rateService.getRatesByRestaurant(req, res);

    const response = responseSuccess(
      result,
      "Rate by Restaurant fetched successfully",
      200
    );

    res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
