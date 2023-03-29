export const convertCamelCaseToPascalCase = (value: string) => {
  return value.replace(/[A-Z]/g, ' $&').replace(/^./, (str) => {
    return str.toLocaleUpperCase();
  });
};
