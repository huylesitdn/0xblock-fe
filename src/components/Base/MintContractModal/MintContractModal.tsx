import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';

import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  Dialog,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
  DialogContent,
  DialogContentProps,
  DialogContentText,
  Button,
  ButtonProps,
  Slide,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  OutlinedInput,
  OutlinedInputProps,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import SquareDarkIcon from 'assets/images/square-dark.gif';
import CubeDarkIcon from 'assets/images/cube-dark.gif';
import TessDarkIcon from 'assets/images/tess-dark.gif';

import CloseImg from 'assets/images/ic-times.svg';
import CloseDarkImg from 'assets/images/ic-close-dark.svg';
import {
  customToast,
  deleteArrayElementByIndex,
  generateContractName,
  handleContractNameErrors,
  replaceArrayElementByIndex,
} from 'helpers';
import BigNumber from 'bignumber.js';
import { useAppDispatch, useAppSelector } from 'stores/hooks';
import { errorMessage } from 'messages/errorMessages';
import { infoMessage } from 'messages/infoMessages';
import { setInsuffBalance, setIsOverMaxMintNodes } from 'services/contract';
import { REGEX_DIGIT } from 'consts/regrex';
import { LIMIT_MAX_MINT } from 'consts/typeReward';

interface Props {
  open: boolean;
  icon: string;
  name: string;
  maxMint: number;
  valueRequire: number;
  contracts: Array<any>;
  onClose: () => void;
  onSubmit: (values: any, name: string) => void;
}

interface Contract {
  name: string;
  error: string | null;
}

const Wrapper = styled(Dialog)<DialogProps>(({ theme }) => ({
  background: 'rgba(165, 199, 251, 0.38)',
  zIndex: 1700,

  '.MuiDialog-container': {
    background: theme.palette.mode === 'light' ? 'rgba(165, 199, 251, 0.38)' : 'rgba(28, 28, 28, 0.36)',
    backdropFilter: `blur(${theme.palette.mode === 'light' ? '4px' : '13px'})`,
  },

  '.MuiPaper-root': {
    width: theme.palette.mode === 'light' ? '309px' : '317px',
    boxShadow: '0px 10px 36px rgba(38, 29, 77, 0.1)',
    borderRadius: '24px',
    padding: '0',
    margin: 0,
    boxSizing: 'border-box',
    border: theme.palette.mode === 'light' ? 'unset' : '1px solid #6F6F6F',
    background: theme.palette.mode === 'light' ? '#fff' : '#2C2C2C',
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewIcon = styled(Box)<BoxProps>(({ theme }) => ({
  width: '55px',
  height: '55px',
  marginRight: '10px',
  borderRadius: '7px',
  overflow: 'hidden',

  img: {
    width: '100%',
  },

  [theme.breakpoints.down('lg')]: {
    width: '42px',
    height: '42px',
  },
  [theme.breakpoints.down('lg')]: {
    width: '55px',
    height: '55px',
  },
}));

const HeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '18px',
  lineHeight: '27px',
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  textTransform: 'uppercase',
  fontWeight: '600',
  maxWidth: '105px',

  [theme.breakpoints.down('lg')]: {
    fontSize: '16px',
    lineHeight: '24px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
    lineHeight: '27px',
  },
}));

const CloseIcon = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  width: '28px',
  height: '28px',
  padding: '0',
  border: 'none',
  marginLeft: 'auto',

  img: {
    width: '100%',
  },

  [theme.breakpoints.down('lg')]: {
    width: '20px',
    height: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '28px',
    height: '28px',
  },
}));

const Header = styled(DialogTitle)<DialogTitleProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '20px 21px',
  marginBottom: '20px',

  [theme.breakpoints.down('lg')]: {
    padding: '16px 21px',
  },
  [theme.breakpoints.down('lg')]: {
    padding: '20px 21px',
  },
}));

const Content = styled(DialogContent)<DialogContentProps>(({ theme }) => ({
  padding: '20px 13px 20px 21px',
  // marginBottom: '21px',

  'p.MuiDialogContentText-root': {
    color: theme.palette.mode === 'light' ? '#828282' : 'rgba(255, 255, 255, 0.29)',
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
    marginBottom: '8px',
    textTransform: 'capitalize',

    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      lineHeight: '18px',
    },
  },

  '.MuiListItemText-root': {
    margin: 0,
  },

  '.MuiTypography-root': {
    color: '#293247',
    fontFamily: 'Poppins',
    fontSize: '14px',
    lineHeight: '21px',

    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      lineHeight: '21px',
    },
  },

  ul: {
    padding: '0 8px 0 0',
    maxHeight: '266px',
    overflow: 'auto',

    '&::-webkit-scrollbar': {
      width: '4px',
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'none',
      webkitBoxShadow: 'none',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#3864FF',
      outline: 'none',
      borderRadius: '10px',
    },

    li: {
      padding: 0,
      // padding: '7px 20px',
      // border: '1px solid #BDBDBD',

      marginBottom: '8px',

      ['.MuiInput-root']: {
        padding: '7px 20px',
        border: theme.palette.mode === 'light' ? '1px solid #BDBDBD' : '1px solid transparent',
        boxSizing: 'border-box',
        borderRadius: '13px',
        background: theme.palette.mode === 'light' ? 'unset' : '#252525',

        [theme.breakpoints.down('sm')]: {
          padding: '12px 20px',
        },
      },
    },
  },
}));

const ButtonMax = styled(Button)<ButtonProps>(() => ({
  width: '79px',
  height: '50px',
  boxSizing: 'border-box',
  border: '1px solid #3864FF',
  borderRadius: '14px',
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '14px',
  lineHeight: '21px',
  textTransform: 'capitalize',
  marginLeft: 'auto',

  '&:hover': {
    opacity: 0.7,
    cursor: 'pointer',
  },
}));

const BoxActions = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: '30px',
  paddingRight: '8px',
}));

const OutlinedInputCustom = styled(OutlinedInput)<OutlinedInputProps>(({ theme }) => ({
  padding: 0,
  border: '1px solid #3864FF',
  borderLeft: 'none',
  borderRight: 'none',
  borderRadius: '14px',
  lineHeight: '24px',
  fontSize: '16px',
  height: '50px',

  fieldset: {
    border: 'none',
  },

  input: {
    width: '65px',
    height: '50px',
    textAlign: 'center',

    fontFamily: 'Poppins',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    color: theme.palette.mode === 'light' ? '#293247' : '#fff',

    '&::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
  },

  '.MuiOutlinedInput-root': {},

  '.MuiInputAdornment-positionStart': {
    border: `1px solid  ${theme.palette.primary.main}`,
    boxSizing: 'border-box',
    borderRadius: '14px',
    width: '50px',
    height: '50px',
    fontSize: '18px',
    maxWidth: '50px',
    maxHeight: '50px',
    margin: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      opacity: 0.7,
      cursor: 'pointer',
    },

    button: {
      color: `${theme.palette.primary.main}`,
      padding: 0,
    },
  },

  '.MuiInputAdornment-positionEnd': {
    border: `1px solid  ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    boxSizing: 'border-box',
    borderRadius: '14px',
    width: '50px',
    height: '50px',
    fontSize: '18px',
    maxWidth: '50px',
    maxHeight: '50px',
    margin: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      opacity: 0.7,
      cursor: 'pointer',
    },

    button: {
      color: '#fff',
      padding: 0,
    },
  },
}));

const ButtonMint = styled('button')<ButtonProps>(({ theme, disabled }) => ({
  width: '100%',
  marginTop: '21px',
  padding: '10px 29px',
  height: '60px',
  textAlign: 'center',
  borderRadius: '14px',
  background: disabled
    ? 'rgba(0, 0, 0, 0.26)'
    : theme.palette.mode === 'light'
    ? theme.palette.primary.main
    : 'linear-gradient(141.34deg, #2978F4 28.42%, #23ABF8 132.6%)',
  color: '#fff',
  display: 'inline-block',
  boxSizing: 'border-box',
  fontFamily: 'Poppins',
  fontWeight: 'bold',
  fontSize: '14px',
  lineHeight: '21px',
  cursor: disabled ? 'not-allowed !important' : 'pointer',
  outline: 'none',
  border: 'none',
  span: {
    fontWeight: 'normal',
    fontSize: '13px',
    opacity: '0.7',
  },

  '&:hover': {
    opacity: 0.7,
    cursor: 'pointer',
  },
}));

const TextName = styled(TextField, { shouldForwardProp: (prop) => prop !== 'error' })<TextFieldProps>(
  ({ theme, error }) => ({
    '.MuiInput-input': {
      OutlinedInput: 'none',
      // boxSizing: 'border-box',
      color: theme.palette.mode === 'light' ? '#293247' : '#fff',
      fontFamily: 'Poppins',
      fontSize: '14px',
    },
    '.MuiFormHelperText-root': {
      color: error ? 'red' : 'rgba(0, 0, 0, 0.6)',
      marginBottom: '4px',
      fontSize: '14px',
      lineHeight: '21px',
    },
    '.MuiInput-root': {
      '&::before': {
        borderBottom: 'unset !important',
      },
      '&::after': {
        borderBottom: 'unset !important',
      },
    },
  }),
);

const ContractIndex = styled(Box)<BoxProps>(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#293247' : '#fff',
  fontFamily: 'Poppins',
  fontSize: '14px',
}));

const BoxError = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: '21px',
  fontSize: '12px',
}));

const preventKeyCodeNumberInput = [190, 69, 189, 187]; // . E + -

const MintContractModal: React.FC<Props> = ({ open, icon, name, maxMint = 10, onClose, onSubmit, valueRequire }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const isCreatingSquareContracts = useAppSelector((state) => state.contract.isCreatingSquareContracts);
  const isCreatingCubeContracts = useAppSelector((state) => state.contract.isCreatingCubeContracts);
  const isCreatingTesseractContracts = useAppSelector((state) => state.contract.isCreatingTesseractContracts);

  const isInsuffBalances = useAppSelector((state) => state.contract.insuffBalance);
  const isLimitNodes = useAppSelector((state) => state.contract.isLimitOwnedNodes);
  const isCloseMintContractModal = useAppSelector((state) => state.contract.isCloseMintContractModal);
  const isOverMaxMintNodes = useAppSelector((state) => state.contract.isOverMaxMintNodes);
  const nodes = useAppSelector((state: any) => state.contract.nodes);
  const zeroXBlockBalance = useAppSelector((state) => state.user.zeroXBlockBalance);

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [valueCost, setValueCost] = useState<number>(valueRequire);
  const [valueInput, setValueInput] = useState<number | string>(contracts.length);
  const [isBlankInput, setIsBlankInput] = useState<boolean>(false);

  const isCreatingContracts = isCreatingSquareContracts || isCreatingCubeContracts || isCreatingTesseractContracts;
  const handleAddContract = (numberContracts = 1) => {
    if (contracts.length >= maxMint) {
      return;
    }

    const newContracts = [];
    for (let i = 0; i < numberContracts; i++) {
      newContracts.push({
        name: generateContractName(),
        error: null,
      });
    }
    setContracts([...contracts, ...newContracts]);
  };

  const handleDeleteContract = () => {
    if (isOverMaxMintNodes) {
      dispatch(setIsOverMaxMintNodes(false));
    }

    // prevent from deleting contract if contracts length = 1
    if (contracts.length >= 2) {
      const newContract = [...contracts];
      newContract.splice(-1);
      setContracts(newContract);
    }
  };

  const handleAddManyContracts = (value: number) => {
    const numberOfContracts = value <= maxMint ? value : maxMint;

    let newContracts = [...contracts];
    if (contracts.length < numberOfContracts) {
      for (let i = contracts.length; i < numberOfContracts; i++) {
        newContracts.push({
          name: generateContractName(),
          error: null,
        });
      }
    } else {
      for (let i = contracts.length; i > numberOfContracts; i--) {
        newContracts = deleteArrayElementByIndex(newContracts, newContracts.length - 1);
      }
    }
    setContracts([...newContracts]);
  };

  const handleContractNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const newName = event.target.value;
    const error = handleContractNameErrors(newName);

    if (
      JSON.stringify(contracts[index]) ===
        JSON.stringify({ ...contracts[index], error: errorMessage.CONTRACT_NAME_MORE_THAN_THIRTY_TWO.message }) ||
      JSON.stringify(contracts[index]) ===
        JSON.stringify({
          ...contracts[index],
          error: errorMessage.CONTRACT_NAME_INVALID_AND_MORE_THAN_32_CHARACTERS.message,
        })
    ) {
      if (event.target.value.length < contracts[index].name.length) {
        const newContract = replaceArrayElementByIndex(contracts, index, {
          ...contracts[index],
          error,
        });
        setContracts(newContract);
      }
      return;
    } else if (
      error === errorMessage.CONTRACT_NAME_MORE_THAN_THIRTY_TWO.message ||
      error === errorMessage.CONTRACT_NAME_INVALID_AND_MORE_THAN_32_CHARACTERS.message
    ) {
      const newContract = replaceArrayElementByIndex(contracts, index, {
        ...contracts[index],
        error,
      });
      setContracts(newContract);
      return;
    }

    const newContract = replaceArrayElementByIndex(contracts, index, {
      name: newName,
      error,
    });
    setContracts(newContract);
  };

  const renderItems = () => {
    return contracts.map((item, index) => {
      return (
        <ListItem key={index}>
          <TextName
            onChange={(event) => handleContractNameChange(event, index)}
            InputProps={{
              startAdornment: <ContractIndex>{index + 1}.&nbsp;</ContractIndex>,
            }}
            error={!!item.error}
            helperText={
              item.error === errorMessage.CONTRACT_NAME_INVALID_AND_MORE_THAN_32_CHARACTERS.message
                ? errorMessage.CONTRACT_NAME_INVALID.message
                : item.error
            }
            value={item.name}
            variant="standard"
            fullWidth
          />
        </ListItem>
      );
    });
  };

  const handleBackdropClick = () => {
    customToast({ message: errorMessage.FINISH_MINT_CONTRACT.message, type: 'error', toastId: 3 });
  };

  useEffect(() => {
    if (!(isCloseMintContractModal && isCreatingContracts)) {
      handleAddManyContracts(1);
      setValueInput(contracts.length);
    }
  }, [isCloseMintContractModal, isCreatingSquareContracts, isCreatingCubeContracts, isCreatingSquareContracts]);

  useEffect(() => {
    setContracts([]);
    if (maxMint > 0) handleAddManyContracts(1);
  }, [maxMint]);

  useEffect(() => {
    setValueCost(new BigNumber(valueRequire).times(contracts.length).toNumber());
    setValueInput(isBlankInput && contracts.length === 0 ? '' : contracts.length);
    if (new BigNumber(zeroXBlockBalance).isLessThan(valueRequire)) dispatch(setInsuffBalance());
  }, [contracts.length]);

  useEffect(() => {
    if (valueInput === '') setContracts([]);
  }, [valueInput]);

  useEffect(() => {
    if (!open) setIsBlankInput(false);
  }, [open]);

  return (
    <Wrapper
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      onBackdropClick={handleBackdropClick}
    >
      <Header>
        <ViewIcon>
          <img
            alt=""
            src={
              theme.palette.mode === 'light'
                ? icon
                : name === 'Square Contract'
                ? SquareDarkIcon
                : name === 'Cube Contract'
                ? CubeDarkIcon
                : name === 'Tesseract Contract'
                ? TessDarkIcon
                : ''
            }
          />
        </ViewIcon>

        <HeaderText>{name}</HeaderText>

        <CloseIcon onClick={onClose}>
          <img alt="" src={theme.palette.mode === 'light' ? CloseImg : CloseDarkImg} />
        </CloseIcon>
      </Header>

      <Content>
        <DialogContentText>Contract Name</DialogContentText>

        <List>{renderItems()}</List>

        <BoxActions>
          <OutlinedInputCustom
            type="text"
            value={valueInput}
            onChange={(event) => {
              const value = event.target.value;
              // if (value.trim() === '') return;

              if (!REGEX_DIGIT.test(value)) {
                event.preventDefault();
                setValueInput('');
                setIsBlankInput(true);
                return;
              }

              if (Number(value) > maxMint) {
                dispatch(setIsOverMaxMintNodes(true));
                setValueInput(maxMint);
                handleAddManyContracts(Number(maxMint));
                setValueCost(new BigNumber(valueRequire).times(maxMint).toNumber());
                event.preventDefault();
                return;
              }

              dispatch(setIsOverMaxMintNodes(false));
              setValueInput(value);
              if (value === '') {
                setIsBlankInput(true);
                return;
              }
              setIsBlankInput(false);
              handleAddManyContracts(Number(value));
            }}
            onBlur={() => {
              if (Number(valueInput) === 0 && valueInput !== '') {
                setValueInput('0');
                return;
              }
              setValueInput(valueInput.toString().replace(/^0+/, ''));
            }}
            onKeyDown={(e) => {
              if (preventKeyCodeNumberInput.includes(e.keyCode)) {
                e.preventDefault();
              }
            }}
            inputProps={{ 'aria-label': 'weight' }}
            startAdornment={
              <InputAdornment position="start" onClick={() => handleDeleteContract()}>
                <IconButton>
                  <RemoveIcon />
                </IconButton>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment
                position="end"
                onClick={() => {
                  handleAddContract(1);
                  dispatch(setIsOverMaxMintNodes(false));
                }}
              >
                <IconButton>
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            }
            aria-describedby="outlined-weight-helper-text"
          />

          <ButtonMax
            variant="outlined"
            color="primary"
            onClick={() => {
              handleAddManyContracts(maxMint);
              dispatch(setIsOverMaxMintNodes(false));
            }}
          >
            Max
          </ButtonMax>
        </BoxActions>

        <BoxError color={'#F62D33'} style={{ display: valueInput !== '' ? 'block' : 'none' }}>
          {isInsuffBalances
            ? infoMessage.INSUFFICIENT_TOKEN.message
            : isLimitNodes
            ? infoMessage.LIMIT_NODES.message.replace('#number', String(LIMIT_MAX_MINT))
            : isOverMaxMintNodes
            ? nodes + contracts.length >= LIMIT_MAX_MINT
              ? infoMessage.LIMIT_NODES.message.replace('#number', String(LIMIT_MAX_MINT))
              : `${infoMessage.OVER_NODES.message
                  .replace('#number', String(maxMint))
                  .replace('#transaction', maxMint < 10 ? 'this' : 'one')
                  .replace('#plusal', maxMint > 1 ? 'contracts' : 'contract')}`
            : ''}
        </BoxError>

        <ButtonMint
          disabled={
            contracts.filter(
              (item) => item.error && item.error !== errorMessage.CONTRACT_NAME_MORE_THAN_THIRTY_TWO.message,
            ).length > 0 ||
            contracts.length === 0 ||
            valueInput === '' ||
            isCreatingContracts ||
            isInsuffBalances ||
            isLimitNodes
          }
          variant="contained"
          color="primary"
          onClick={() => {
            onSubmit(contracts, name);
          }}
        >
          Mint <br />
          <span>{`(${valueCost} 0xB required)`}</span>
        </ButtonMint>
      </Content>
    </Wrapper>
  );
};

export default MintContractModal;
