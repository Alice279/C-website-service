module.exports = {
  schedule: {
    interval: '10m', // 10 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
    immediate: true,
  },
  async task(ctx) {
    ctx.service.source.updateDexAssetList();
    ctx.service.source.updateDexAccumulatedTxAmount();
    ctx.service.source.updateCrosschainList();
    ctx.service.source.updateUnionList();
    ctx.service.source.updateDexTotalUsersStat();
    ctx.service.source.updateDexTotalTradesStat();
  },
};
