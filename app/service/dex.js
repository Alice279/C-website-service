const api = require('../../util/api');
const bigNumber = require('bignumber.js');
const lodash = require('lodash');
const egg = require('egg');

class DexService extends egg.Service {
  async list() {
    const { config } = this;
    const proArr = [];
    proArr.push(api.getBoomFlow(config));
    proArr.push(api.geturrencies(config));
    proArr.push(this.getAccumulatedTxAmount());
    const res = await Promise.all(proArr);
    const boomFlowAddress = res[0].data.data;
    const assetList = res[1].data.data.items;
    const accumulatedTxObj = res[2];
    const dataArr = [];
    dataArr.push({
      name: 'boomflow',
      address: boomFlowAddress,
      icon: config.icon.contract.boomflow,
      url: config.apiUrl.confluxscan + '/address/' + boomFlowAddress,
    });
    const sortedAssetList = lodash.sortBy(assetList, [
      function(item) {
        return config.dexAsset.sortBy.indexOf(item.name);
      },
    ]);
    sortedAssetList.forEach(function(item) {
      dataArr.push({
        name: config.dexAsset.namePrefix + ' ' + item.name,
        address: item.contractAddress,
        totalSupply: accumulatedTxObj[item.name],
        icon: config.icon.contract[item.name.toLowerCase()],
        url: config.apiUrl.confluxscan + '/token/' + item.contractAddress,
      });
    });
    return dataArr;
  }

  async getTotalCount() {
    const { config } = this;
    const {
      data: {
        data: { items: productList },
      },
    } = await api.getProductList(config);
    const proArr = [];
    productList.forEach(function(item) {
      proArr.push(api.getMarketTickers(config, { product: item.name, period: '1month' }));
    });
    const res = await Promise.all(proArr);
    let totalCount = new bigNumber(0);
    res.forEach(function(item) {
      item.data.data.forEach(function(assetMarketItem) {
        totalCount = totalCount.plus(assetMarketItem.count);
      });
    });
    return totalCount.toNumber();
  }

  async getAccumulatedTxAmount() {
    const proArr = [];
    const { config } = this;
    proArr.push(api.getTotalDepositStat(config));
    proArr.push(api.getTotalWithdrawStat(config));
    proArr.push(api.getTotalForceWithdrawStat(config));
    const res = await Promise.all(proArr);
    const totalDepositObj = res[0].data.value;
    const totalWithdrawObj = res[1].data.value;
    const totalForceWithdrawObj = res[2].data.value;
    const accumulatedTxObj = {};
    for (const [key, value] of Object.entries(totalDepositObj)) {
      accumulatedTxObj[key] = new bigNumber(value)
        .minus(totalWithdrawObj[key] || 0)
        .minus(totalForceWithdrawObj[key] || 0)
        .toFixed();
    }
    return accumulatedTxObj;
  }
}

module.exports = DexService;
