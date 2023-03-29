export const limitedStringNumbers = (str: String | null, length: number, onlyAfterDecimal = false) => {
  if (str) {
    if (onlyAfterDecimal) {
      const string = str.split('.');
      const matchedNumbers = string[1] ? string[1] : string[0].match(/[0-9]/g);
      if (matchedNumbers && matchedNumbers.length > length) {
        return string[1] ? string[0] + '.' + string[1].slice(0, length + 1) + '...' : string[0];
      }
      return string[1] ? string[0] + '.' + string[1] : string[0];
    } else {
      const matchedNumbers = str.match(/[0-9]/g);
      if (matchedNumbers && matchedNumbers.length >= length) {
        return str.slice(0, length + 1) + '...';
      }
      return str;
    }
  }
  return str;
};
