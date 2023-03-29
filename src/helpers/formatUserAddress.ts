export const formatUserAddress = (address: string) => {
  const firstFiveCharacters = address.slice(0, 5);
  const lastFiveCharacters = address.slice(address.length - 5, address.length);
  return firstFiveCharacters + '...' + lastFiveCharacters;
};
