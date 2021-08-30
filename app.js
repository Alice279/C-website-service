class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  // configWillLoad() {
  // }

  // async didLoad() {

  // }

  // async willReady() {
  // }

  // async didReady() {

  // }

  async serverDidReady() {
    this.app.logger.info('restart application ' + new Date());
  }
}

module.exports = AppBootHook;
