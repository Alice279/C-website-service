const sentryLoader = require('./sentry');
const errorsLoader = require('./errors');
const confluxLoader = require('./conflux');
module.exports = {
  get sentry() {
    return sentryLoader(this);
  },
  get errors() {
    return errorsLoader(this);
  },
  get conflux() {
    return confluxLoader(this);
  },

  /**
   * get error info object
   * @returns {function(err:Error|null):{code:number, message:string}}
   */
  get formatError() {
    const {
      config: { env, nonProdEnvList },
      errors: { AppError },
      logger,
    } = this;

    return (err = null) => {
      if (err === null) {
        return { code: 0, message: '' };
      }

      if (err.constructor.name === 'CommonError') {
        return { code: err.code, message: err.message };
      }
      if (!(err instanceof AppError)) {
        logger.error(JSON.stringify({ message: err.message, stack: err.stack }));
        err = new AppError();
      }

      if (nonProdEnvList.includes(env)) {
        err.message = `${err.message}\n${err.stack}`;
      }
      return { code: err.code, message: err.message };
    };
  },
};
