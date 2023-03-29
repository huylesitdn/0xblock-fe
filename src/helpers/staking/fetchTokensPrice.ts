export const fetchTokensPrice = async (token: string) => {
  const rawData = await fetch(String(process.env.REACT_APP_GRAPH_API_URL), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
                query getData ($token: String) {
                  tokenDayDatas(where: {
                    token: $token,
                  },
                    first: 1,
                    orderBy: date,
                    orderDirection: desc
                  ){
                    token {
                      id
                    }
                    priceUSD
                    token{
                      symbol
                    }
                  }
              }
           `,
      variables: {
        token,
      },
    }),
  });
  const data = await rawData.json();
  return data.data.tokenDayDatas;
};
