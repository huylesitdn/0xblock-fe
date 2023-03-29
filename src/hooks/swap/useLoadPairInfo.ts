import { getPairsInfoIntervalTime } from 'consts/swap';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { useToast } from 'hooks/useToast';
import { errorMessage } from 'messages/errorMessages';
import { useEffect } from 'react';
import { setPairData, setPairInfoLoaded } from 'services/swap';
import { useAppDispatch } from 'stores/hooks';
import { SwapTokenId } from './useSwapToken';

export const useLoadPairInfo = () => {
  const dispatch = useAppDispatch();
  const { getPairsInfo } = useInteractiveContract();
  const { createToast } = useToast();
  const handleLoadPairInfo = async () => {
    try {
      const [WAVAX_OXB, WAVAX_USDC, WAVAX_USDT] = await getPairsInfo();
      dispatch(
        setPairData({
          [SwapTokenId.OXB]: WAVAX_OXB,
          [SwapTokenId.AVAX]: WAVAX_OXB,
          [SwapTokenId.USDC]: WAVAX_USDC,
          [SwapTokenId.USDT]: WAVAX_USDT,
        }),
      );
      dispatch(setPairInfoLoaded(true));
    } catch (error: any) {
      if (error.code === 'NETWORK_ERROR') {
        createToast({
          message: errorMessage.NO_NETWORK_ERROR.message,
          type: 'error',
        });
      }
      createToast({
        message: error.message,
        type: 'error',
      });
    }
  };
  useEffect(() => {
    handleLoadPairInfo();
    const interval = setInterval(() => {
      handleLoadPairInfo();
    }, getPairsInfoIntervalTime);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);
};
