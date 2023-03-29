import _ from 'lodash';
import {
  setApy,
  setPrice,
  setTokenDistribution,
  setTotal,
  unSetApy,
  unSetPrice,
  unSetTokenDistribution,
  unSetTotal,
} from 'services/contract';
import { formatAprV3 } from 'helpers/formatApy';
import { useAppDispatch } from 'stores/hooks';
import { bigNumber2NumberV2, bigNumber2NumberV4 } from 'helpers/formatNumber';
import { useEffect } from 'react';
import { useInteractiveContract } from './useInteractiveContract';

const useFetchInforContract = () => {
  const dispatch = useAppDispatch();
  const { getRewardAPRAllNode, getPriceAllNode, getTotalNodeByType, getTokenDistribution } = useInteractiveContract();

  const fetchApy = async () => {
    try {
      const response = await getRewardAPRAllNode();
      const data = _.flatten(response);
      dispatch(
        setApy({
          square: formatAprV3(data[0]),
          cube: formatAprV3(data[1]),
          tesseract: formatAprV3(data[2]),
        }),
      );
    } catch (e) {
      dispatch(unSetApy());
    }
  };

  const fetchPrice = async () => {
    try {
      const response = await getPriceAllNode();
      const data = _.flatten(response);

      dispatch(
        setPrice({
          square: bigNumber2NumberV2(data[0]),
          cube: bigNumber2NumberV2(data[1]),
          tesseract: bigNumber2NumberV2(data[2]),
        }),
      );
    } catch (e) {
      dispatch(unSetPrice());
    }
  };

  const fetchTotal = async () => {
    try {
      const response = await getTotalNodeByType();
      const data = _.flatten(response);
      dispatch(
        setTotal({
          square: bigNumber2NumberV2(data[0], 1),
          cube: bigNumber2NumberV2(data[1], 1),
          tesseract: bigNumber2NumberV2(data[2], 1),
        }),
      );
    } catch (e) {
      dispatch(unSetTotal());
    }
  };

  const fetchTokenDistribution = async () => {
    try {
      const response = await getTokenDistribution();
      const data = _.flatten(response);

      dispatch(
        setTokenDistribution({
          developmentFee: bigNumber2NumberV4(data[0], 1),
          liquidityPoolFee: bigNumber2NumberV4(data[1], 1),
          rewardsFee: bigNumber2NumberV4(data[2], 1),
          treasuryFee: bigNumber2NumberV4(data[3], 1),
          cashOutFee: bigNumber2NumberV4(data[4], 1),
        }),
      );
    } catch (e) {
      dispatch(unSetTokenDistribution());
    }
  };

  useEffect(() => {
    fetchApy();
    fetchPrice();
    fetchTotal();
    fetchTokenDistribution();
  }, []);
};

export default useFetchInforContract;
