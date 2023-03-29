export const deleteArrayElementByIndex = (array: any[], position: number) => {
  return array.filter((item, index) => index !== position);
};
