import { ContractResponse, MineContract } from 'interfaces/MyContract';
import { zipWith } from 'lodash';
import { computeEarnedTokenPerDay } from 'helpers/computeEarnedTokenPerDay';
import { bigNumber2NumberV3 } from 'helpers/formatNumber';
import { ContractPrice } from 'interfaces/ContractPrice';
import { formatPrice, truncateNumber } from './formatPrice';
import BigNumber from 'bignumber.js';

export const parseDataMyContract = (data: string) => {
  return data.split('#');
};

const calculateEarnCurrent0xbPerDay = (price: number, apr: string) => {
  const convertedApr = bigNumber2NumberV3(String(apr), 1e6);
  const tokenEarnedPerYear = new BigNumber(convertedApr).multipliedBy(price).div(36500).toNumber();
  const truncatedNumber = truncateNumber(tokenEarnedPerYear, 3);
  return formatPrice(String(truncatedNumber), 3, 3);
};

export const parseDataInitApy = (types: string, initApy: string, prices: ContractPrice) => {
  const _types = parseDataMyContract(types);
  const _initApy = parseDataMyContract(initApy);

  const _typesLen = _types.length;
  const _initApyLen = _initApy.length;

  if (_typesLen > 0 && _initApyLen > 0 && _typesLen === _initApyLen) {
    const zipTypesInitApy = zipWith(_types, _initApy);
    // TODO: fixme reusable code
    return zipTypesInitApy.map((item: any) => {
      if (item[0] === '0') return computeEarnedTokenPerDay(prices.square, bigNumber2NumberV3(item[1], 1e6));
      if (item[0] === '1') return computeEarnedTokenPerDay(prices.cube, bigNumber2NumberV3(item[1], 1e6));
      return computeEarnedTokenPerDay(prices.tesseract, bigNumber2NumberV3(item[1], 1e6));
    });
  }
  return [];
};

export const parseDataCurrentApr = (types: string, currentAprPerContract: string[], prices: ContractPrice) => {
  const _types = parseDataMyContract(types);

  if (_types.length > 0) {
    return currentAprPerContract.map((apr: string, index) => {
      if (_types[index] === '0') return calculateEarnCurrent0xbPerDay(prices.square, apr);
      else if (_types[index] === '1') return calculateEarnCurrent0xbPerDay(prices.cube, apr);
      return calculateEarnCurrent0xbPerDay(prices.tesseract, apr);
    });
  }
  return [];
};

export const zipDataMyContract = (param: ContractResponse) => {
  return zipWith(
    param.mintDates,
    param.names,
    param.types,
    param.initZeroXBlockPerDays,
    param.currentZeroXBlockPerDays,
    param.rewards,
    param.claimedRewards,
    (a, b, c, d, e, f, g) =>
      ({
        mintDate: a,
        name: b,
        type: c,
        initial: d,
        current: e,
        rewards: f,
        claimedRewards: g,
      } as MineContract),
  );
};
