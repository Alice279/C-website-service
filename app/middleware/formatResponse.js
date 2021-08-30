module.exports = () => {
  return async function(ctx, next) {
    const {
      app: { errors, formatError },
    } = ctx;

    try {
      await next();
      ctx.body = {
        code: 0,
        message: '',
        result: ctx.body || {}, // body in [0, '', null, undefined] will trans to {}
      };
    } catch (e) {
      if (
        (typeof process.env.NODE_ENV === 'string' && process.env.NODE_ENV.includes('test')) ||
        (typeof process.env.EGG_SERVER_ENV === 'string' && process.env.EGG_SERVER_ENV.includes('test'))
      ) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      // sentry
      if (!(e instanceof errors.AppError)) {
        ctx.captureException(e);
      }

      ctx.body = {
        ...formatError(e),
        result: e.result || {},
      };
    }
  };
};
