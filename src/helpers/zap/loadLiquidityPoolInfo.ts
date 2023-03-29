export const loadLiquidityPoolInfo = async () => {
  const rawData = await fetch(String(process.env.REACT_APP_GRAPH_API_URL), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
                query getData ($token0: String!, $token1: String!) {
                  pairs (
                    where: {
                      token0_in: [
                        $token0,
                        $token1,
                      ],
                      token1_in: [
                        $token0,
                        $token1,                      
                      ]
                    }
                  )
                  {
                    token0{
                      symbol
                    }
                    token1{
                      symbol
                    }
                    reserve0
                    reserve1
                    totalSupply
                }
              }
           `,
      variables: {
        token0: String(process.env.REACT_APP_CONTRACT_ADDRESS).toLocaleLowerCase(),
        token1: String(process.env.REACT_APP_NATIVE_TOKEN_ADDRESS).toLocaleLowerCase(),
      },
    }),
  });
  const data = await rawData.json();
  return data.data.pairs;
};
