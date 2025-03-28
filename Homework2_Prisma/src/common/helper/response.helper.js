export const responseSuccess = (
  data = null,
  message = "success",
  statusCode = 200
) => {
  return {
    status: "Success",
    statusCode: statusCode,
    message: message,
    data: data,
    doc: "docs url",
  };
};

export const responseError = (
  message = "Internal Server Error",
  statusCode = 500,
  stack = null
) => {
  return {
    status: "Error",
    statusCode: statusCode,
    message: message,
    stack: stack,
    doc: "docs url",
  };
};
