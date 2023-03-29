import { useQuery } from 'urql';
import { PairQuery } from 'consts/query';
import { useAppDispatch } from 'stores/hooks';
import { setPairData } from 'services/traderJoe';
import { useEffect } from 'react';

const useFetchPairData = () => {
  const dispatch = useAppDispatch();

  const [result, reExecuteQuery] = useQuery({
    query: PairQuery,
    variables: {
      pairId: '0xe66a111ade51cec994f3de6cd10fdd0096ee7c28',
    },
  });

  const refresh = () => {
    reExecuteQuery({ requestPolicy: 'network-only' });
  };

  useEffect(() => {
    if (result.data) {
      dispatch(setPairData(result.data?.pair?.reserve0));
      return;
    }
    dispatch(setPairData(0));
  }, [result.data]);

  return { refresh };
};

export default useFetchPairData;
