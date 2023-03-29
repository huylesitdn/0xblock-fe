import { errorMessage } from 'messages/errorMessages';

export const handleContractNameErrors = (contractName: string) => {
  let error = null;

  const alphaAndNumericReg = new RegExp(/^[A-Za-z0-9\_]+$/);

  const isValidName = alphaAndNumericReg.test(contractName);

  if (contractName.trim() === '') {
    error = errorMessage.CONTRACT_NAME_EMPTY.message;
  } else if (contractName.length < 4) {
    error = errorMessage.CONTRACT_NAME_LESS_THAN_FOUR.message;
  } else if (!isValidName && contractName.length > 32) {
    error = errorMessage.CONTRACT_NAME_INVALID_AND_MORE_THAN_32_CHARACTERS.message;
  } else if (!isValidName) {
    error = errorMessage.CONTRACT_NAME_INVALID.message;
  } else if (contractName.length > 32) {
    error = errorMessage.CONTRACT_NAME_MORE_THAN_THIRTY_TWO.message;
  }
  return error;
};
