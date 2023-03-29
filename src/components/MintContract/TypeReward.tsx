import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'hooks/useWindowSize';
import { styled, useTheme } from '@mui/material/styles';
import { Paper, PaperProps, Box, BoxProps, Typography, TypographyProps, Button, ButtonProps } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import LineChart from 'components/Base/LineChart';
import MintContractModal from 'components/Base/MintContractModal';
import MintStatusModal from 'components/Base/MintStatusModal';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import BigNumber from 'bignumber.js';
import { contractType, LIMIT_MAX_MINT, LIMIT_ONE_TIME_MINT } from 'consts/typeReward';
import { useFetchNodes } from 'hooks/useFetchNodes';
import {
  setInsuffBalance,
  setIsCreatingNodes,
  setIsLimitOwnedNodes,
  setIsOverMaxMintNodes,
  toggleIsCloseMintContractModal,
  unSetInsuffBalance,
  unSetIsCreatingNodes,
  unSetIsLimitOwnedNodes,
} from 'services/contract';
import { computedRewardRatioPerYear } from 'helpers/computedRewardRatioPerYear';
import { RewardRatioChart } from 'interfaces/RewardRatioChart';
import { customToast } from 'helpers';
import { errorMessage } from 'messages/errorMessages';
import { useWeb3React } from '@web3-react/core';
import get from 'lodash/get';
import { getToken } from 'services/auth';
import { infoMessage } from 'messages/infoMessages';
import { useFetchAccountBalance } from 'hooks/useFetchAccountBalance';
import { formatNumberWithComas } from 'helpers/formatPrice';
import { useInteractiveContract } from 'hooks/useInteractiveContract';
import { ReactComponent as WarnIcon } from 'assets/images/ic-warn-blue.svg';
import { ReactComponent as WarnDarkIcon } from 'assets/images/ic-warn-circle-dark.svg';

interface Props {
  id: any;
  icon: string;
  name: string;
  value: number;
  apy: string;
  earn: string;
  color: string;
  colorChart: string;
  // dataChart: Array<any>;
  loading: boolean;
  isCreatingContracts?: boolean;
  help?: boolean;
}

const Wrapper = styled(Paper)<PaperProps>(({ theme }) => ({
  width: '100%',
  marginBottom: '15px',
  padding: '0 12px',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '24px',
  boxShadow: '0px 0px 48px rgba(0, 0, 0, 0.06)',
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : 'rgba(255, 255, 255, 0.03)',

  [theme.breakpoints.down('md')]: {
    display: 'inline-block',
    width: '100%',
    padding: '22px 31px 26px',
  },
}));

const BoxContract = styled(Box)<BoxProps>(({ theme }) => ({
  padding: '10px 17px',
  display: 'inline-flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  width: '286px',
  boxShadow: '0px 14px 26px -2px rgba(0, 0, 0, 0.08)',
  borderRadius: '15px',

  [theme.breakpoints.down('lg')]: {
    width: '230px',
    padding: '10px 12px',
    boxSizing: 'border-box',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    justifyContent: 'center',
  },
}));

const BoxContent = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // width: '100%',
  boxSizing: 'border-box',
  width: 'calc(100% - 286px)',

  [theme.breakpoints.down('lg')]: {
    width: 'calc(100% - 230px)',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    marginTop: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginTop: '0',
    display: 'inline-block',
  },
}));

const ViewImage = styled(Box)<BoxProps>(({ theme }) => ({
  width: '43px',
  height: '43px',

  [theme.breakpoints.down('lg')]: {
    width: '30px',
    height: '30px',
  },
  [theme.breakpoints.down('md')]: {
    width: '43px',
    height: '43px',
  },
}));

const Name = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  color: theme.palette.mode === 'light' ? '#293247' : '#131722',
  fontSize: '16px',
  lineHeight: '24px',
  textTransform: 'uppercase',
  fontWeight: 600,
  margin: '0 0 0 10px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

const ViewInfo = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'inline-flex',
  width: 'calc(100% - 158px)',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  paddingLeft: '48px',
  paddingRight: '10px',
  boxSizing: 'border-box',
  overflow: 'hidden',
  margin: '0 auto',

  [theme.breakpoints.down('lg')]: {
    paddingLeft: '24px',
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    paddingLeft: '0',
    width: 'calc(100% - 120px)',
    justifyContent: 'flex-start',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '0',
    display: 'block',
  },
}));

const Info = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'inline-flex',
  // width: '100%',
  width: '65%',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    width: '100%',
    margin: '18px 0 6px 0',
  },
}));

const Text = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '21px',
  fontFamily: 'Poppins',
  minWidth: '114px',
  width: 'auto',

  [theme.breakpoints.up('xl')]: {
    width: '30%',
  },
  [theme.breakpoints.down('lg')]: {
    fontSize: '12px',
    lineHeight: '18px',
    minWidth: '40px',
    padding: '0 12px',
    boxSizing: 'border-box',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0',
    width: 'auto',
    fontSize: '12px',
    lineHeight: '21px',
    marginBottom: '7px',
  },
}));

const ButtonMint = styled(Button)<ButtonProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '14px',
  lineHeight: '21px',
  padding: '12px',
  width: '158px',
  borderRadius: ' 14px',
  fontWeight: 'bold',
  textTransform: 'capitalize',
  color: theme.palette.primary[theme.palette.mode],
  border: `1px solid ${theme.palette.primary[theme.palette.mode]}`,

  '&:hover': {
    color: theme.palette.primary[theme.palette.mode],
    border: `1px solid ${theme.palette.primary[theme.palette.mode]}`,
    opacity: 0.7,
  },

  [theme.breakpoints.up('xl')]: {},
  [theme.breakpoints.down('lg')]: {
    fontSize: '13px',
    lineHeight: '18px',
    width: '120px',
    padding: '10px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    margin: ' 27px 0 0',
    display: 'block',
  },
}));

const ViewChart = styled('div')<any>`
  width: 143px;
  height: 80px;
  padding-top: 10px;
  margin-bottom: 0px;

  @media (min-width: 1441px) {
    width: 200px;
    //height: 88px;
  }
  @media (max-width: 900px) {
    width: 120px;
    /* height: 30px; */
  }

  @media (max-width: 600px) {
    width: 100%;
    //height: 60px;
  }
`;

const TooltipCustom = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.mode === 'light' ? '#e4e4e4' : '#000',
    top: '5px !important',

    ['&::before']: {
      boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
      backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#3E3E3E',
    },
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : '#3E3E3E',
    boxShadow: '0px 1px 7px rgba(0, 0, 0, 0.08)',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',
    fontFamily: 'Poppins',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '22px',
    borderRadius: '7px',
    padding: '2px 10px',
  },
  zIndex: 1200,
}));

const ViewHelp = styled(Box)<BoxProps>(() => ({
  marginRight: '10px',
}));

const BoxRight = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const STATUS = ['success', 'error', 'pending', 'permission denied'];

const TypeReward: React.FC<Props> = ({
  id,
  icon,
  name,
  value,
  apy,
  earn,
  color,
  colorChart,
  loading,
  isCreatingContracts = false,
  help = false,
}) => {
  const dispatch = useAppDispatch();
  const [width] = useWindowSize();
  const theme = useTheme();

  const zeroXBlockBalance = useAppSelector((state) => state.user.zeroXBlockBalance);
  const nodes = useAppSelector((state: any) => state.contract.nodes);
  const currentUserAddress = useAppSelector((state) => state.user.account?.address);
  const { getMintPermit, createMultipleNodesWithTokens, contractWithSigner } = useInteractiveContract();

  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState<any>(STATUS[2]);
  const [maxMint, setMaxMint] = useState<number>(-1);
  const [crtNodeOk, setCreateNodeOk] = useState<boolean>(false);
  const [dataChart, setDataChart] = useState<Array<RewardRatioChart>>([]);
  const [openTooltip, setOpenTooltip] = useState(true);
  const [isMetamaskConfirmPopupOpening, setIsMetamaskConfirmPopupOpening] = useState(false);
  const [claimingTransactionHash, setClaimingTransactionHash] = useState('');
  const [transactionHashCompleted, setTransactionHasCompleted] = useState('');
  const [transactionError, setTransactionError] = useState('');

  const { error } = useWeb3React();
  const { fetchAccount0XB } = useFetchAccountBalance();
  const { fetchNodesOfUser } = useFetchNodes();

  const handleToggle = async () => {
    if (open) {
      setOpen(!open);
      return;
    }

    if (get(error, 'name') === 'UnsupportedChainIdError' && getToken()) {
      customToast({ message: errorMessage.META_MASK_WRONG_NETWORK.message, type: 'error' });
      return;
    }

    if (!getToken()) {
      customToast({ message: errorMessage.MINT_CONTRACT_NOT_CONNECT_WALLET.message, type: 'error' });
      return;
    }

    if (!currentUserAddress) return;
    await fetchAccount0XB(currentUserAddress);
    await fetchNodesOfUser(currentUserAddress);

    setOpen(!open);
    dispatch(unSetInsuffBalance());
    dispatch(unSetIsLimitOwnedNodes());
    dispatch(toggleIsCloseMintContractModal(!open));
    dispatch(setIsOverMaxMintNodes(false));

    if (new BigNumber(zeroXBlockBalance).isLessThanOrEqualTo(0) || new BigNumber(zeroXBlockBalance).isLessThan(value)) {
      dispatch(setInsuffBalance());
      return;
    }

    if (nodes === LIMIT_MAX_MINT) {
      dispatch(setIsLimitOwnedNodes());
      return;
    }
  };

  const handleResetTransactionWaiting = () => {
    setClaimingTransactionHash('');
    setTransactionHasCompleted('');
    setTransactionError('');
  };

  const handleToggleStatus = () => {
    if (openStatus && !isMetamaskConfirmPopupOpening) {
      dispatch(unSetIsCreatingNodes());
      handleResetTransactionWaiting();
    }
    setOpenStatus(!openStatus);
  };

  const handleTransactionCompleted = (txHash: string) => {
    setTransactionHasCompleted(txHash);
  };

  const handleTransactionError = (txHash: string) => {
    setTransactionError(txHash);
  };

  const convertIdToName = (id: number) => {
    if (id === 0) {
      return 'square';
    } else if (id === 1) {
      return 'cube';
    } else return 'tesseract';
  };
  const handleSubmit = async (params: Record<string, string>[], type: string) => {
    let txHash = '';
    try {
      setOpen(false);
      setStatus(STATUS[2]);
      setOpenStatus(true);
      dispatch(
        setIsCreatingNodes({
          type: convertIdToName(id),
        }),
      );
      const mintPermit = await getMintPermit();
      if (!mintPermit[0]) {
        setStatus(STATUS[3]);
        return;
      }

      const names = params.map((item) => item.name);
      const key = type.split(' ')[0].toLowerCase();
      const cType = contractType[`${key}`];

      setIsMetamaskConfirmPopupOpening(true);
      const response: Record<string, any> = await createMultipleNodesWithTokens(names, cType);
      setIsMetamaskConfirmPopupOpening(false);
      if (response.hash) {
        txHash = response.hash;
        setClaimingTransactionHash(response.hash);
        await response.wait();
        handleTransactionCompleted(response.hash);
      }
    } catch (e: any) {
      if (txHash !== '') {
        handleTransactionError(txHash);
      } else {
        setIsMetamaskConfirmPopupOpening(false);
        setStatus(STATUS[1]);
        setOpen(false);
        setOpenStatus(true);
        dispatch(unSetIsCreatingNodes());
      }
    }
  };

  const handleBackToMint = () => {
    setOpenStatus(false);
    setOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenTooltip(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const balances = zeroXBlockBalance !== '' ? zeroXBlockBalance : 0;
    const _maxMint = new BigNumber(balances).div(value).integerValue(BigNumber.ROUND_DOWN).toNumber();
    const restMintAbleContracts = LIMIT_MAX_MINT - nodes;
    const numberMintAbleContracts = _maxMint >= LIMIT_ONE_TIME_MINT ? LIMIT_ONE_TIME_MINT : _maxMint;
    setMaxMint(numberMintAbleContracts >= restMintAbleContracts ? restMintAbleContracts : numberMintAbleContracts);
  }, [zeroXBlockBalance, nodes, value]);

  useEffect(() => {
    dispatch(unSetInsuffBalance());
    dispatch(unSetIsLimitOwnedNodes());
    if (new BigNumber(zeroXBlockBalance).isLessThan(value)) dispatch(setInsuffBalance());
    if (new BigNumber(nodes).isEqualTo(LIMIT_MAX_MINT)) dispatch(setIsLimitOwnedNodes());
  }, [currentUserAddress, zeroXBlockBalance]);

  useEffect(() => {
    if (!open) {
      dispatch(setIsOverMaxMintNodes(false));
    }
  }, [open]);

  useEffect(() => {
    setDataChart(computedRewardRatioPerYear(earn));
  }, [earn]);

  useEffect(() => {
    if (transactionError !== '' && claimingTransactionHash === transactionError) {
      setIsMetamaskConfirmPopupOpening(false);
      setOpenStatus(true);
      setStatus(STATUS[1]);
      dispatch(unSetIsCreatingNodes());
      setTransactionError('');
    }
  }, [claimingTransactionHash, transactionError]);

  useEffect(() => {
    // if user close loading popup, mint status listener will be closed
    if (!openStatus && loading && !isMetamaskConfirmPopupOpening) {
      dispatch(unSetIsCreatingNodes());
      handleResetTransactionWaiting();
    }
  }, [openStatus, loading, isMetamaskConfirmPopupOpening]);

  useEffect(() => {
    if (claimingTransactionHash === transactionHashCompleted && claimingTransactionHash !== '') {
      setOpenStatus(true);
      setStatus(STATUS[0]);
      dispatch(unSetIsCreatingNodes());
      setClaimingTransactionHash('');
      setTransactionHasCompleted('');
    }
  }, [claimingTransactionHash, transactionHashCompleted]);
  useEffect(() => {
    const provider = contractWithSigner;
    const mintContractListener = (address: string) => {
      if (address === currentUserAddress) {
        setCreateNodeOk(!crtNodeOk);
      }
    };
    if (loading) {
      provider.once('ContsMinted', mintContractListener);
    }
    return () => {
      provider.off('ContsMinted', mintContractListener);
    };
  }, [loading, currentUserAddress]);

  useFetchNodes(crtNodeOk);

  return (
    <Wrapper>
      <BoxContract sx={{ background: color }}>
        <ViewImage>
          <img alt="" src={icon} width="100%" />
        </ViewImage>
        <Name>{name}</Name>
      </BoxContract>

      <BoxContent>
        <ViewInfo>
          <Info>
            <Text>{value} 0xB</Text>
            <Text>{formatNumberWithComas(Number(apy))}% APR</Text>
            <Text>Earn {earn} 0xB/day</Text>
          </Info>

          <TooltipCustom
            className="tooltipMonths"
            open={openTooltip}
            title="Months"
            arrow
            placement={width > 600 ? 'right-end' : 'right-end'}
          >
            <ViewChart onMouseEnter={() => setOpenTooltip(true)} onMouseLeave={() => setOpenTooltip(false)}>
              <TooltipCustom open={openTooltip} title="Rewards" arrow placement="left-start">
                <span />
              </TooltipCustom>
              <LineChart data={dataChart} color={colorChart} id={id} />
            </ViewChart>
          </TooltipCustom>
        </ViewInfo>

        <BoxRight>
          {help && (
            <TooltipCustom
              title={
                <div>
                  <p style={{ margin: 0 }}>This contract is applied Monthly subscription fee</p>
                </div>
              }
              arrow
              placement="bottom-end"
            >
              {theme.palette.mode === 'light' ? (
                <ViewHelp>
                  <WarnIcon width={16} />
                </ViewHelp>
              ) : (
                <ViewHelp
                  sx={{
                    marginTop: '5px',
                  }}
                >
                  <WarnDarkIcon width={16} />
                </ViewHelp>
              )}
            </TooltipCustom>
          )}

          <ButtonMint disabled={isCreatingContracts} variant="outlined" color="primary" onClick={handleToggle}>
            Mint
          </ButtonMint>
        </BoxRight>
      </BoxContent>

      {open && (
        <MintContractModal
          icon={icon}
          name={name}
          maxMint={maxMint}
          valueRequire={value}
          contracts={['Name']}
          open={open}
          onClose={handleToggle}
          onSubmit={handleSubmit}
        />
      )}

      <MintStatusModal
        icon={status === STATUS[3] ? '' : icon}
        name={status === STATUS[3] ? '' : name}
        open={openStatus}
        status={status}
        text={
          status === 'success'
            ? 'Contract minted successfully'
            : status === 'error'
            ? 'Contract minting failed'
            : status === 'pending'
            ? 'Processing'
            : status === 'permission denied'
            ? infoMessage.PERMISSION_DENIED.message
            : 'Insufficient Tokens'
        }
        onClose={handleToggleStatus}
        onBackToMint={handleBackToMint}
      />
    </Wrapper>
  );
};

export default TypeReward;
