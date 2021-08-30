const lodash = require('lodash');
const moment = require('moment');

module.exports = (options = {}) => {
  return async function(ctx, next) {
    const startTime = Date.now();

    const requestId = `${moment().format('YYYYMMDD-HHmmssSS')}-${lodash.random(0, 99999999)}`;
    try {
      ctx.requestId = requestId;
      await next();
    } finally {
      const request = {
        http: ctx.req.httpVersion,
        method: ctx.request.method,
        url: ctx.request.url,
        params: ctx.params,
        query: ctx.request.query,
        header: ctx.request.header,
        body: ctx.request.body,
      };

      const response = {
        duration: Date.now() - startTime,
        status: ctx.response.status,
        message: ctx.response.message,
        header: ctx.response.header,
        body: ctx.response.body,
        length: ctx.response.length,
      };

      ctx.set('x-request-id', requestId);
      ctx.logger.info(
        JSON.stringify(
          {
            requestId,
            request: lodash.pick(request, options.request || []),
            response: lodash.pick(response, options.response || []),
          },
          null,
          options.space || 0
        )
      );
    }
  };
};
