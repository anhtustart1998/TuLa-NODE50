import { responseError } from "./response.helper.js";

export const handleError = (err, req, res, next) => {
  console.log(err);
  const response = responseError(err.message, err.statusCode, err.stack);
  res.status(response.statusCode).json(response);
};
