declare let window: any;

export const onClickConnect = async () => {
  try {
    return await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
