/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const icon = require('./icon');
const PACKAGE = require('../package.json');
const defaultConfig = require('./config.default.js');
const conf = {
  // use for cookie sign key, should change to your own and keep security
  keys: '1594263685732_6274',

  // add your middleware config here
  middleware: ['requestLog', 'formatResponse'],
  dexSecretKey: 'ConfluxFDSiof0j20fJFDHbSkgnkl5gkGDSKL',
  apiUrl: {
    dex: 'https://api.matchflow.io',
    crossChain: 'https://api.shuttleflow.io/?secretkey=ConfluxFDSiof0j20fJFDHbSkgnkl5gkGDSKL',
    confluxMainnet: 'http://scanpage-main.confluxrpc.org:12537',
    confluxTestnet: 'http://scanpage-test.confluxrpc.org:12537',
    confluxscan: 'https://confluxscan.io',
    tokenIcon: 'https://conflux-static.oss-cn-beijing.aliyuncs.com/icons',
  },
  dexAsset: {
    sortBy: ['FC', 'BTC', 'ETH', 'USDT', 'DAI', 'COMP', 'KNC', 'DF'],
    namePrefix: 'DEX',
  },
  crossChainAsset: {
    sortBy: ['BTC', 'ETH', 'USDT', 'DAI', 'MOON'],
    namePrefix: 'Conflux',
  },
  unionAccount: {
    sortBy: ['kaoba', 'kaoma', 'dappbirds', 'bitpie'],
  },

  nonProdEnvList: ['local', 'ci', 'unittest', 'unittest-local', 'unittest-ci'],
  sentry: {
    dsn: 'https://a465c18082b34a6e9ed0a18003d88cdc@sentry.conflux-chain.org/7',
    release: `${PACKAGE.name}@${PACKAGE.version}`,
  },
  icon,
};
module.exports = Object.assign({}, defaultConfig, conf);
