/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/api/crosschain/asset/list', controller.crosschain.list);
  router.get('/api/crosschain/union/list', controller.crosschain.getUnionList);
  router.get('/api/dex/asset/list', controller.dex.list);
  router.get('/api/dex/dashboard', controller.dex.dashboard);
};
