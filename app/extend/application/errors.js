let app;

class AppError extends Error {
  static extend(status, { code, message } = {}) {
    class SubError extends this {}

    SubError.status = status === undefined ? this.status : status;
    SubError.code = code === undefined ? this.code : code;
    SubError.message = message === undefined ? this.message : message;
    return SubError;
  }

  constructor(...args) {
    super(...args);
    app.logger.error(`Error("${this.message}")`);
  }

  /**
   * @returns {number}
   */
  get status() {
    return this.constructor.status;
  }

  /**
   * @returns {number}
   */
  get code() {
    return this.constructor.code;
  }

  /**
   * @returns {string}
   */
  get message() {
    return super.message || this.constructor.message;
  }

  set message(message) {
    super.message = message;
  }
}

AppError.status = 200;
AppError.code = 1000;
AppError.message = 'AppError';

const errors = {
  AppError,
};

module.exports = function(application) {
  app = application;
  return errors;
};
