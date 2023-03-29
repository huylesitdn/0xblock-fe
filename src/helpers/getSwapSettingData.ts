import { defaultSettingData, localStorageSwapSettingKey } from 'consts/swap';

interface SwapSettingData {
  slippage: string;
  deadline: string;
}

export const getSwapSettingData = (): SwapSettingData => {
  const rawData = localStorage.getItem(localStorageSwapSettingKey);
  return rawData ? JSON.parse(rawData) : defaultSettingData;
};
