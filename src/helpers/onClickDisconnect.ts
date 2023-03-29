declare let window: any;

export const onClickDisconnect = async () => {
  try {
    return await window.ethereum.request({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }],
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
