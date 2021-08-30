const Controller = require('egg').Controller;
const CONSTOBJ = require('../../config/const');

class DexController extends Controller {
  async list() {
    const { ctx, service } = this;
    const list = await service.source.get(CONSTOBJ.CACHE.KEY.DEXASSETLIST);
    ctx.body = {
      list,
    };
  }
  async dashboard() {
    const { ctx, service } = this;
    const queryParams = ctx.request.query;
    const fields = queryParams.fields || '';
    const fieldParams = fields.split(',');
    const res = {};
    if (fieldParams.indexOf('accumulatedTxAmount') !== -1) {
      res.accumulatedTxAmount = await service.source.get(CONSTOBJ.CACHE.KEY.TOTALTRADESTAT);
    }
    if (fieldParams.indexOf('addressAmount') !== -1) {
      res.addressAmount = await service.source.get(CONSTOBJ.CACHE.KEY.TOTALUSERSTAT);
    }
    ctx.body = res;
  }
}

module.exports = DexController;
