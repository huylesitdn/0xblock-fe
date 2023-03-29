import { bigNumber2Number } from 'helpers/formatNumber';
import { useEffect, useState } from 'react';
import { setNativeBalance, setZeroXBlockBalance, unSetNativeBalance, unSetZeroXBlockBalance } from 'services/account';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { useInteractiveContract } from './useInteractiveContract';
import { useToast } from './useToast';

export const useFetchAccountBalance = () => {
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const zeroXBlockBalance = useAppSelector((state) => state.user.zeroXBlockBalance);
  const nativeBalance = useAppSelector((state) => state.user.nativeBalance);
  const { getBalanceTokenOf, getBalanceNativeTokenOf } = useInteractiveContract();
  const [zeroXBLoading, setZeroXBLoading] = useState<boolean>(false);
  const [nativeTokenLoading, setNativeTokenLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { createToast } = useToast();

  const fetchAccount0XB = async (address?: string): Promise<void> => {
    if (address) {
      setZeroXBLoading(true);
      try {
        const zeroXBlockToken = await getBalanceTokenOf(address);
        if (zeroXBlockToken[0]) {
          const zeroXBlockBalance = bigNumber2Number(zeroXBlockToken[0]);
          dispatch(setZeroXBlockBalance(zeroXBlockBalance));
        }
      } catch {
        createToast({
          message: 'Oop! Something went wrong',
          type: 'error',
        });
      }
      setZeroXBLoading(false);
    }
  };

  const fetchAccountNativeToken = async (address?: string) => {
    if (address) {
      setNativeTokenLoading(true);
      try {
        const nativeToken = await getBalanceNativeTokenOf(address);
        const nativeBalance = bigNumber2Number(nativeToken);
        dispatch(setNativeBalance(nativeBalance));
      } catch {
        createToast({
          message: 'Oop! Something went wrong',
          type: 'error',
        });
      }
      setNativeTokenLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserAddress) {
      fetchAccount0XB(currentUserAddress);
      fetchAccountNativeToken(currentUserAddress);
      return;
    } else {
      dispatch(unSetNativeBalance());
      dispatch(unSetZeroXBlockBalance());
    }
  }, [currentUserAddress]);

  return {
    fetchAccount0XB,
    fetchAccountNativeToken,
    nativeTokenLoading,
    zeroXBLoading,
    zeroXBlockBalance,
    nativeBalance,
  };
};
