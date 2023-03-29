import BigNumber from 'bignumber.js';
import get from 'lodash/get';
export const EstimateSwapTokenOutConvertMap = {
  [`0xbToavax` as string]: [
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
  ],
  [`0xbTousdc` as string]: [
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
    process.env.REACT_APP_USDC_DECIMALS || 18,
  ],
  [`avaxTo0xb` as string]: [
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
  ],
  [`usdcTo0xb` as string]: [
    process.env.REACT_APP_USDC_DECIMALS || 18,
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
  ],
};

export const EstimateSwapTokenInConvertMap = {
  [`0xbToavax` as string]: [
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
  ],
  [`0xbTousdc` as string]: [
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
    process.env.REACT_APP_USDC_DECIMALS || 18,
  ],
  [`avaxTo0xb` as string]: [
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
  ],
  [`usdcTo0xb` as string]: [
    process.env.REACT_APP_NATIVE_CURRENCY_DECIMALS || 18,
    process.env.REACT_APP_CONTRACT_DECIMAL || 18,
    process.env.REACT_APP_USDC_DECIMALS || 18,
  ],
};

export const convertGetAmountTokenData = (_data: any, _fromId: string, _toId: string) => {
  const data = get(_data, 'swapTokenRates.callsReturnContext', []);
  if (data.length > 0) {
    const convertMap = EstimateSwapTokenOutConvertMap[`${_fromId}To${_toId}`];
    return {
      [data[0].reference]: data[0].returnValues.map(
        (
          item: {
            type: string;
            hex: string;
          },
          index: number,
        ) => {
          return new BigNumber(item.hex).div(Number(`1e${convertMap[index]}`)).toString();
        },
      ),
      [data[1].reference]: data[1].returnValues.map(
        (
          item: {
            type: string;
            hex: string;
          },
          index: number,
        ) => {
          return new BigNumber(item.hex).div(Number(`1e${convertMap[index]}`)).toString();
        },
      ),
    };
  }
  return null;
};
