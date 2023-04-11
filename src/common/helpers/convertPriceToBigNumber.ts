import { BigNumber, ethers } from 'ethers';

export const convertPriceToBigNumber = (price: any, decimal: number) => {
  const res = ethers.utils.parseUnits(price.toString(), decimal);
  return BigNumber.from(res.toString());
};
