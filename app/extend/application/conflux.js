const { Conflux } = require('js-conflux-sdk');

// ----------------------------------------------------------------------------
const ConfluxAppStr = Symbol('Application#Conflux');

module.exports = function(app) {
  if (!app[ConfluxAppStr]) {
    const cfx = new Conflux({
      url: app.config.apiUrl.confluxMainnet,
      defaultGasPrice: 100,
      defaultGas: 1000000,
    });
    app[ConfluxAppStr] = cfx;
  }
  return app[ConfluxAppStr];
};
