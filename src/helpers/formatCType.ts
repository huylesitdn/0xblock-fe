export const formatCType = (cType: string): string => {
  return {
    0: 'Square',
    1: 'Cube',
    2: 'Tesseract',
  }[Number(cType)] as any;
};
