import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

import { ClaimModal, ManagePools, MyStake, StakeStatusModal } from 'components/Stake';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { useFetchLPTokenBalance } from 'hooks/staking/useFetchLPTokenBalance';
import { useWeb3React } from '@web3-react/core';
import { convertStakingData } from 'helpers/staking';
import { setSelectedPoolData, setStakingFeeTimeLevels, setStakingRecordsLimit } from 'services/staking';
import { useFetchOxbTokenBalance } from 'hooks/staking/useFetchOxbTokenBalance';
import { fetTableDataIntervalTime } from 'consts/stake';
import BigNumber from 'bignumber.js';
import get from 'lodash/get';
import { useToast } from 'hooks/useToast';
interface Props {
  title?: string;
}

const Wrapper = styled(Box)<BoxProps>(() => ({
  width: '100%',
}));

const StakePage: React.FC<Props> = () => {
  const { claimRewards, claimAllRewards, getPoolInfo, getStakingRecordsLimit, getEarlyUnstakeFeeTime } =
    useInteractiveContract();
  const { account } = useWeb3React();
  const { createToast } = useToast();
  const [currentTab, setCurrentTab] = useState<'allPool' | 'myPool'>('allPool');
  const [claimType, setClaimType] = useState<'claim_all' | 'claim'>('claim_all');
  const [status, setStatus] = useState<any>(null);
  const dispatch = useAppDispatch();
  const [openStatus, setOpenStatus] = useState(false);

  const [openClaimAll, setOpenClaimAll] = useState(false);

  const [selected, setSelected] = useState<number>(-1);
  const [poolToClaim, setPoolToClaim] = useState('0');
  const [selectedIndex, setSelectedIndex] = useState('0');

  const pools = useAppSelector((state) => state.stake.pools);
  const myPools = pools.filter((item) => Number(item.yourTotalStakedAmount) > 0);
  const selectedPool = pools.filter((item) => item.id === String(selected))[0];

  const selectedPoolTableData = useAppSelector((state) => state.stake.selectedPoolData);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { handleGetTokenBalances } = useFetchLPTokenBalance();
  const { handleGetTokenBalances: getOxbBalance } = useFetchOxbTokenBalance();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [currentTransactionId, setCurrenTransactionId] = useState({
    type: '',
    id: '',
  });
  const [txCompleted, setTxCompleted] = useState({
    type: '',
    id: '',
  });

  const handleToggleClaimAll = () => {
    setClaimType('claim_all');
    setOpenClaimAll(!openClaimAll);
  };

  const handleToggleClaimOne = () => {
    setClaimType('claim');
    setOpenClaimAll(!openClaimAll);
  };

  const closeClaimModal = () => {
    setOpenClaimAll(false);
  };

  const handleToggleStatus = () => {
    if (openStatus) {
      setStatus(null);
    }
    setOpenStatus(!openStatus);
  };

  const closeStatusModal = () => {
    setOpenStatus(false);
  };

  const handleFetchTableData = async () => {
    try {
      // setTableDataLoading(true);
      const selectedPoolInfo = await getPoolInfo(account!, String(selected));
      const convertedData = convertStakingData({
        dates: selectedPoolInfo.yourStakingTimes[0].split('#'),
        stakedAmounts: selectedPoolInfo.yourStakedAmounts[0].split('#'),
        rewards: selectedPoolInfo.yourRewardAmounts[0].split('#'),
      });
      dispatch(
        setSelectedPoolData({
          id: String(selected),
          data: convertedData,
        }),
      );
    } catch {}
    setTableDataLoading(false);
  };

  const handleConfirmClaim = async () => {
    handleToggleStatus();
    closeClaimModal();
    setStatus('pending');
    try {
      if (claimType === 'claim_all') {
        const transaction = await claimAllRewards(poolToClaim);
        if (transaction.hash) {
          setCurrenTransactionId({
            id: transaction.hash,
            type: 'claimAll',
          });
          await transaction.wait();
          setTxCompleted({
            id: transaction.hash,
            type: 'claimAll',
          });
          handleFetchTableData();
        }
      } else if (claimType === 'claim') {
        const transaction = await claimRewards(poolToClaim, [selectedIndex]);
        if (transaction.hash) {
          setCurrenTransactionId({
            id: transaction.hash,
            type: 'claim',
          });
          await transaction.wait();
          setTxCompleted({
            id: transaction.hash,
            type: 'claim',
          });
          handleFetchTableData();
        }
      }
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (currentTransactionId.id !== '' && currentTransactionId.id === txCompleted.id) {
      setStatus('success');
      setOpenStatus(true);
      setTxCompleted({
        id: '',
        type: '',
      });
      setSelectedRows([]);
    }
  }, [currentTransactionId, txCompleted]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (selected !== -1 && account) {
      createToast({
        promise: {
          callback: handleFetchTableData,
          pendingMessage: 'Loading...',
          successMessage: 'Your staking data is fetched successfully',
        },
        autoClose: 500,
      });
      interval = setInterval(() => {
        handleFetchTableData();
      }, fetTableDataIntervalTime);
    } else if (!account) {
      dispatch(
        setSelectedPoolData({
          id: '',
          data: [],
        }),
      );
      setSelected(-1);
    } else if (selected === -1) {
      setTableDataLoading(true);
      dispatch(
        setSelectedPoolData({
          id: '',
          data: [],
        }),
      );
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selected, account]);

  const loadStakingRecordLimit = async () => {
    try {
      const limit = await getStakingRecordsLimit();
      dispatch(setStakingRecordsLimit(new BigNumber(get(limit, '_hex', 100)).toString()));
    } catch {}
  };

  const loadEarlyStakingFeeTime = async () => {
    try {
      const stakingFeeTime = await getEarlyUnstakeFeeTime();
      dispatch(setStakingFeeTimeLevels(stakingFeeTime.split('#').filter((item: string) => item !== '')));
    } catch {}
  };

  useEffect(() => {
    loadStakingRecordLimit();
    loadEarlyStakingFeeTime();
  }, []);

  return (
    <Wrapper>
      {selected === -1 ? (
        <ManagePools
          onClaimAll={(id) => {
            setPoolToClaim(id);
            handleToggleClaimAll();
          }}
          currentTab={currentTab}
          tabChange={setCurrentTab}
          pools={currentTab === 'allPool' ? pools : myPools}
          onNext={setSelected}
        />
      ) : (
        <MyStake
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          tableDataLoading={tableDataLoading}
          handleToggleClaimOne={(index) => {
            setSelectedIndex(String(index));
            setPoolToClaim(String(selected));
            handleToggleClaimOne();
          }}
          handleToggleClaimAll={() => {
            setPoolToClaim(String(selected));
            handleToggleClaimAll();
          }}
          data={selectedPool}
          tableData={String(selected) === selectedPoolTableData.id ? selectedPoolTableData.data : []}
          onBack={() => setSelected(-1)}
          handleGetTokenBalances={
            selectedPool.lpAddress.toLocaleLowerCase() ===
            String(process.env.REACT_APP_CONTRACT_ADDRESS).toLocaleLowerCase()
              ? getOxbBalance
              : handleGetTokenBalances
          }
        />
      )}

      <ClaimModal
        data={pools.filter((item) => item.id === String(poolToClaim))[0]}
        selectedIndex={Number(selectedIndex)}
        type={claimType}
        open={openClaimAll}
        onClose={() => {
          closeClaimModal();
          setCurrenTransactionId({
            type: '',
            id: '',
          });
        }}
        onConfirm={handleConfirmClaim}
      />

      <StakeStatusModal
        type="claim"
        title={claimType === 'claim_all' ? 'Claim all' : 'Claim rewards'}
        open={openStatus}
        onClose={closeStatusModal}
        status={status}
        onNextStatus={() => {
          window.open(`${process.env.REACT_APP_EXPLORER_URLS}/tx/${currentTransactionId.id}`, '_blank');
        }}
      />
    </Wrapper>
  );
};

export default StakePage;
