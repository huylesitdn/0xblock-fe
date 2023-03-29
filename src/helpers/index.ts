import { addEthereumChain } from 'helpers/addChain';
import { isMetaMaskInstalled } from 'helpers/isMetaMaskInstalled';
import { onClickConnect } from 'helpers/onClickConnect';
import { getSignerSignMessage } from 'helpers/signMessage';
import { onClickDisconnect } from 'helpers/onClickDisconnect';
import { formatUserAddress } from './formatUserAddress';
import { generateContractName } from './generateContractName';
import { deleteArrayElementByIndex } from './deleteArrayElementByIndex';
import { replaceArrayElementByIndex } from './replaceArrayElementByIndex';
import { handleContractNameErrors } from './handleContractNameErrors';
import { getJsonDataFromString } from './getJsonDataFromString';
import { customToast } from './customToast';
import { formatReward } from './formatReward';
import { getTokenBalanceFromWalletAddress } from './getTokenBalanceFromWalletAddress';
import { checkTransactionIsValid } from './checkTransactionIsValid';
import { getSwapSettingData } from './getSwapSettingData';
export {
  addEthereumChain,
  isMetaMaskInstalled,
  onClickConnect,
  getSignerSignMessage,
  onClickDisconnect,
  formatUserAddress,
  generateContractName,
  deleteArrayElementByIndex,
  replaceArrayElementByIndex,
  handleContractNameErrors,
  getJsonDataFromString,
  customToast,
  formatReward,
  getTokenBalanceFromWalletAddress,
  checkTransactionIsValid,
  getSwapSettingData,
};
