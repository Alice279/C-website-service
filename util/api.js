const axios = require('axios');
const queryString = require('query-string');
function getDexUrl({ config, api, params }) {
  const queryParams = { ...params, secretkey: config.dexSecretKey };
  const url = config.apiUrl.dex + api + '?' + queryString.stringify(queryParams);
  return url;
}

/**
 * Gen a random json rpc id.
 * It is used in `call` method, overwrite it to gen your own id.
 *
 * @return {string}
 */
function requestId() {
  return `${Date.now()}${Math.random().toFixed(7).substring(2)}`; // 13+7=20 int string
}

function rpcCall(config, method, ...params) {
  const data = { jsonrpc: '2.0', id: requestId(), method, params };
  return axios.post(config.apiUrl.crossChain, data);
}

function getBoomFlow(config) {
  return axios.get(getDexUrl({ config, api: '/common/boomflow' }));
}

function geturrencies(config) {
  return axios.get(getDexUrl({ config, api: '/currencies' }));
}

function getTotalForceWithdrawStat(config) {
  return axios.get(getDexUrl({ config, api: '/system/metrics/conflux.dex.service.statistics.TotalForceWithdrawStat' }));
}

function getTotalWithdrawStat(config) {
  return axios.get(getDexUrl({ config, api: '/system/metrics/conflux.dex.service.statistics.TotalWithdrawStat' }));
}

function getTotalDepositStat(config) {
  return axios.get(getDexUrl({ config, api: '/system/metrics/conflux.dex.service.statistics.TotalDepositStat' }));
}

function getTotalUsersStat(config) {
  return axios.get(getDexUrl({ config, api: '/system/metrics/conflux.dex.service.statistics.TotalUsersStat' }));
}

function getMarketTickers(config, params) {
  return axios.get(getDexUrl({ config, api: '/market/tickers', params }));
}

function getProductList(config) {
  return axios.get(getDexUrl({ config, api: '/products' }));
}

function getCustodianAddress(config) {
  return rpcCall(config, 'getCustodianAddress');
}

function getTokenList(config) {
  return rpcCall(config, 'getTokenList');
}

function getTotalTradesStat(config) {
  return axios.get(getDexUrl({ config, api: '/system/metrics/conflux.dex.service.statistics.TotalTradesStat' }));
}

function getTokenIcon(url) {
  return axios.get(url);
}

module.exports = {
  getDexUrl,
  getBoomFlow,
  geturrencies,
  getTotalForceWithdrawStat,
  getTotalWithdrawStat,
  getTotalDepositStat,
  getTotalUsersStat,
  getMarketTickers,
  getProductList,
  rpcCall,
  getCustodianAddress,
  getTotalTradesStat,
  getTokenList,
  getTokenIcon,
};
