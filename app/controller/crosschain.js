const Controller = require('egg').Controller;
const CONSTOBJ = require('../../config/const');
class CrosschainController extends Controller {
  async list() {
    const { ctx, service } = this;
    const list = await service.source.get(CONSTOBJ.CACHE.KEY.CROSSCHAINLIST);
    ctx.body = {
      list: list || [],
    };
  }

  async getUnionList() {
    const { ctx, service } = this;
    const list = await service.source.get(CONSTOBJ.CACHE.KEY.UNIONLIST);
    ctx.body = {
      list: list || [],
    };
  }
}
module.exports = CrosschainController;
