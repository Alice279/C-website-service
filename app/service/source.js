const egg = require('egg');
const memoryCache = {};
const CONSTOBJ = require('../../config/const');
const api = require('../../util/api');
class SourceService extends egg.Service {
  async get(key) {
    return memoryCache[key];
  }
  async updateDexAssetList() {
    // update memory cache from remote
    const { ctx, service } = this;
    const dexAssetList = await service.dex.list();
    memoryCache[CONSTOBJ.CACHE.KEY.DEXASSETLIST] = dexAssetList;
    ctx.logger.info('update memory cache:dexAssetList  from remote: %j', memoryCache);
  }

  async updateDexAccumulatedTxAmount() {
    // update memory cache from remote
    const { ctx, service } = this;
    const res = await service.dex.getTotalCount();
    memoryCache[CONSTOBJ.CACHE.KEY.ACCUMULATEDTXAMOUNT] = res;
    ctx.logger.info('update memory cache:accumulatedTxAmount from remote: %j', memoryCache);
  }

  async updateCrosschainList() {
    // update memory cache from remote
    const { ctx, service } = this;
    const res = await service.crosschain.list();
    memoryCache[CONSTOBJ.CACHE.KEY.CROSSCHAINLIST] = res;
    ctx.logger.info('update memory cache:crosschainList from remote: %j', memoryCache);
  }

  async updateUnionList() {
    // update memory cache from remote
    const { ctx, service } = this;
    const res = await service.crosschain.getUnionList();
    memoryCache[CONSTOBJ.CACHE.KEY.UNIONLIST] = res;
    ctx.logger.info('update memory cache:unionList from remote: %j', memoryCache);
  }

  async updateDexTotalUsersStat() {
    // update memory cache from remote
    const { ctx, config } = this;
    const res = await api.getTotalUsersStat(config);
    memoryCache[CONSTOBJ.CACHE.KEY.TOTALUSERSTAT] = (res && res.data && res.data.count) || 0;
    ctx.logger.info('update memory cache:TotalUsersStat from remote: %j', memoryCache);
  }

  async updateDexTotalTradesStat() {
    // update memory cache from remote
    const { ctx, config } = this;
    const res = await api.getTotalTradesStat(config);
    memoryCache[CONSTOBJ.CACHE.KEY.TOTALTRADESTAT] = (res && res.data && res.data.count) || 0;
    ctx.logger.info('update memory cache:TotalTradesStat from remote: %j', memoryCache);
  }
}

module.exports = SourceService;
