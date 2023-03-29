import BigNumber from 'bignumber.js';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { useEffect } from 'react';
import { setTotalPools } from 'services/staking';
import { useAppDispatch } from 'stores/hooks';
import range from 'lodash/range';
import { useToast } from 'hooks/useToast';
export const useFetchTotalStakingPool = () => {
  const dispatch = useAppDispatch();
  const { getTotalStakingPools } = useInteractiveContract();
  const { createToast } = useToast();
  const handleGetTotalPools = async () => {
    try {
      const totalPools = await getTotalStakingPools();
      dispatch(setTotalPools(range(new BigNumber(totalPools._hex).toNumber())));
    } catch (error) {
      createToast({
        message: 'Some thing wrong',
        type: 'error',
      });
    }
  };
  useEffect(() => {
    handleGetTotalPools();
  }, []);
};
