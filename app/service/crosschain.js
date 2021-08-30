const lodash = require('lodash');
const bigNumber = require('bignumber.js');
const api = require('../../util/api');
const erc777Contract = require('../../config/ERC777.json');
const { custodianAddressData } = require('../mock');
const egg = require('egg');

class CrossChainService extends egg.Service {
  async list() {
    const { config } = this;
    const _this = this;
    const proArr = [];
    proArr.push(api.getCustodianAddress(config));
    proArr.push(api.getTokenList(config));
    const res = await Promise.all(proArr);
    const governanceContractAddress = res[0].data.result.governance_contract.address;
    const governanceContractUrl = res[0].data.result.governance_contract.url;
    let tokenList = res[1].data.result;
    tokenList = tokenList.filter((item) => item.symbol.includes('cMOONLP') === false);
    tokenList = tokenList.map((item) => {
      item.symbol = item.symbol.substring(1);
      return item;
    });
    const sortedTokenList = lodash.sortBy(tokenList, [
      function(item) {
        if (config.crossChainAsset.sortBy.indexOf(item.symbol) !== -1) {
          return config.crossChainAsset.sortBy.indexOf(item.symbol);
        }
        return config.crossChainAsset.sortBy.length + tokenList.indexOf(item);
      },
    ]);

    const list = [];
    list.push({
      name: 'custodian',
      address: governanceContractAddress || '',
      icon: config.icon.contract.custodian,
      url: governanceContractUrl || '',
    });
    const promiseArr = [];
    sortedTokenList.forEach(function(item) {
      promiseArr.push(_this.getContractTotalSupply(item.ctoken));
    });
    const response = await Promise.all(promiseArr);
    for (const [index, item] of response.entries()) {
      const totalSupply = new bigNumber(item).dividedBy(10 ** 18).toNumber();
      const reference = sortedTokenList[index].reference;
      const tokenIconUrlConfig = config.apiUrl.tokenIcon;
      let tokenIcon = `${tokenIconUrlConfig}/${reference}.png`;
      try {
        await api.getTokenIcon(`${tokenIconUrlConfig}/${reference}.png`);
      } catch (error) {
        tokenIcon = `${tokenIconUrlConfig}/default.png`;
      }
      let icon;
      switch (reference) {
        case 'btc':
          icon = config.icon.default.btc;
          break;
        case 'eth':
          icon = config.icon.default.eth;
          break;
        default:
          icon = tokenIcon;
          break;
      }
      list.push({
        name: config.crossChainAsset.namePrefix + ' ' + sortedTokenList[index].symbol,
        address: item.ctoken,
        totalSupply,
        icon,
        url: config.apiUrl.confluxscan + '/token/' + sortedTokenList[index].ctoken,
        reference: sortedTokenList[index].reference,
      });
    }
    return list;
  }

  async getUnionList() {
    const { config } = this;
    const {
      data: { result },
    } = await api.getCustodianAddress(config);
    const governanceAccount = {
      governance: {
        btc_hot: result.btc_hot_wallet,
        btc_cold: result.btc_cold_wallet,
        eth_hot: result.eth_wallet,
        eth_cold: result.eth_wallet,
      },
    };
    const list = [];
    list.push(governanceAccount);
    const members = result.members;
    const arr = [];
    for (const [key, value] of Object.entries(members)) {
      const obj = value;
      obj.name = key;
      if (config.unionAccount.sortBy.indexOf(key) !== -1) {
        arr.push(obj);
      }
    }
    const sortedArr = lodash.sortBy(arr, [
      function(item) {
        return config.unionAccount.sortBy.indexOf(item.name);
      },
    ]);
    sortedArr.forEach(function(item, index) {
      let key = item;
      let icon = '';
      if (index === 0) {
        key = 'confluxone';
        icon = config.icon.brand.conflux;
      }
      if (index === 1) {
        key = 'confluxtwo';
        icon = config.icon.brand.conflux;
      }
      if (item.name.includes('dappbirds')) {
        key = 'dappbirds';
        icon = config.icon.brand.dappbirds;
      }
      if (item.name.includes('bitpie')) {
        key = 'bitpie';
        icon = config.icon.brand.bitpie;
      }
      const obj = {};
      obj[key] = members[item.name];
      obj[key].icon = icon;
      list.push(obj);
    });
    return list;
  }

  async getContractTotalSupply(contractAddress) {
    const {
      app: { conflux },
    } = this;
    const contract = conflux.Contract({
      abi: erc777Contract.abi,
      // code is unnecessary
      address: contractAddress,
    });
    const value = await contract.totalSupply();
    return value.toString();
  }

  async getCustodianAddress() {
    return custodianAddressData;
  }
}

module.exports = CrossChainService;
