import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { bigNumber2NumberV2 } from 'helpers/formatNumber';
import { setRewardAmount, unSetRewardAmount } from 'services/contract';
import { useInteractiveContract } from './useInteractiveContract';

const useFetchRewardAmount = () => {
  const dispatch = useAppDispatch();
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const { getRewardAmount } = useInteractiveContract();
  const fetchRewardAmount = async () => {
    try {
      const response = await getRewardAmount();
      const data = bigNumber2NumberV2(response[0], 1e18);
      if (currentUserAddress) {
        dispatch(setRewardAmount(data));
        return;
      }
      dispatch(unSetRewardAmount());
    } catch (e) {
      dispatch(unSetRewardAmount());
    }
  };

  useEffect(() => {
    fetchRewardAmount();
  }, [currentUserAddress]);

  return { fetchRewardAmount };
};

export default useFetchRewardAmount;
