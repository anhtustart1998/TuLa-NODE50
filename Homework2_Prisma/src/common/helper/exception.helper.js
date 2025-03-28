export class BadRequestException extends Error {
  constructor(message = "BadRequestException") {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFoundException extends Error {
  constructor(message = "NotFoundException") {
    super(message);
    this.statusCode = 404;
  }
}
