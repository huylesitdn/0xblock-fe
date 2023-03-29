import { uniqueNamesGenerator, adjectives, names, animals, Config } from 'unique-names-generator';

const config: Config = {
  dictionaries: [adjectives, names, animals],
  separator: '_',
  length: 3,
};

export const generateContractName = (): string => {
  let contractName = uniqueNamesGenerator(config);
  while (contractName.length > 32) {
    contractName = uniqueNamesGenerator(config);
  }
  return contractName.charAt(0).toUpperCase() + contractName.slice(1);
};
