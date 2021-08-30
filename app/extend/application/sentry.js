const sentry = require('@sentry/node');

// ----------------------------------------------------------------------------
const SENTRY = Symbol('Application#Sentry');

module.exports = function(app) {
  if (!app[SENTRY]) {
    sentry.init(app.config.sentry);
    app[SENTRY] = sentry;
  }
  return app[SENTRY];
};
