module.exports = {
  /**
   * use sentry to capture error under within ctx
   * @param {Error} e
   */
  captureException(e) {
    const {
      app: { config, sentry },
      logger,
    } = this; // this is ctx

    if (config.nonProdEnvList.includes(config.env)) {
      logger.info(`skip captureException cause env="${config.env}", error="${e.message}"`);
      return;
    }

    sentry.configureScope((scope) => {
      scope.setTag('environment', config.env);
      scope.setExtras({
        url: this.request.url,
        header: this.request.header,
        body: this.request.body,
        message: e.message,
        stack: e.stack,
      });
    });
    sentry.captureException(e);
  },
};
