interface Params {
  value: string;
  minValueCondition: number | string;
  callback?: any;
  addLessThanSymbol?: boolean;
  callBackParams?: any[];
  insertCharacter?: string;
}

export const formatForNumberLessThanCondition = (params: Params) => {
  const { value, minValueCondition, callback, addLessThanSymbol = true, callBackParams = [], insertCharacter } = params;
  if (Number(value) < Number(minValueCondition) && Number(value) !== 0) {
    return addLessThanSymbol
      ? '<' + (insertCharacter ? insertCharacter : '') + String(minValueCondition)
      : String(minValueCondition);
  }
  return callback ? callback(value, ...callBackParams) : value;
};
