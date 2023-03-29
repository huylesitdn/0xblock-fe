import HomeIcon from 'assets/images/home.svg';
import AddIcon from 'assets/images/add-circle.svg';
import SliderIcon from 'assets/images/slider.svg';
import HomeActIcon from 'assets/images/home-active.svg';
import HomeDarkIcon from 'assets/images/home-dark.svg';
import HomeDarkActIcon from 'assets/images/active-dark-home.svg';
import AddActIcon from 'assets/images/add-active.svg';
import AddDarkIcon from 'assets/images/plus-dark.svg';
import AddActDarkIcon from 'assets/images/add-active-dark.svg';
import SliderActIcon from 'assets/images/slider-active.svg';
import SliderDarkIcon from 'assets/images/slider-dark.svg';
import SliderActDarkIcon from 'assets/images/slider-active-dark.svg';
import BankIcon from 'assets/images/bank.svg';
import BankActIcon from 'assets/images/bank-active.svg';
import BankDarkIcon from 'assets/images/bank-dark.svg';
import BankActiveDarkIcon from 'assets/images/bank-active-dark.svg';
import ContractIcon from 'assets/images/contract.svg';
import ActiveContractIcon from 'assets/images/active-contract.svg';
import ActiveDarkContractIcon from 'assets/images/active-dark-contract.svg';
import ZapIcon from 'assets/images/zap.svg';
import ActiveZapIcon from 'assets/images/active-zap.svg';
import ZapActiveDarkIcon from 'assets/images/zap-active-dark.svg';
import StakeIcon from 'assets/images/bxs_lock.svg';
import StakeActiveIcon from 'assets/images/bxs_lock-active.svg';
import StakeDarkActiveIcon from 'assets/images/bxs_lock-dark-active.svg';

export const menus = [
  {
    name: 'Dashboard',
    path: '/',
    icon: HomeIcon,
    activeIcon: HomeActIcon,
    darkIcon: HomeDarkIcon,
    activeDarkIcon: HomeDarkActIcon,
  },
  {
    name: 'Mint Contracts',
    path: '/mint-contracts',
    icon: AddIcon,
    activeIcon: AddActIcon,
    darkIcon: AddDarkIcon,
    activeDarkIcon: AddActDarkIcon,
  },
  {
    name: 'My Contracts',
    path: '/my-contracts',
    icon: ContractIcon,
    activeIcon: ActiveContractIcon,
    darkIcon: ContractIcon,
    activeDarkIcon: ActiveDarkContractIcon,
  },
  {
    name: 'Treasury',
    path: '/treasury',
    icon: BankIcon,
    activeIcon: BankActIcon,
    darkIcon: BankDarkIcon,
    activeDarkIcon: BankActiveDarkIcon,
  },
  {
    name: 'Swap',
    path: '/swap',
    icon: SliderIcon,
    activeIcon: SliderActIcon,
    darkIcon: SliderDarkIcon,
    activeDarkIcon: SliderActDarkIcon,
  },
  {
    name: 'Zap',
    path: '/zap',
    icon: ZapIcon,
    activeIcon: ActiveZapIcon,
    darkIcon: ZapIcon,
    activeDarkIcon: ZapActiveDarkIcon,
  },
  {
    name: 'Stake',
    path: '/stake',
    icon: StakeIcon,
    activeIcon: StakeActiveIcon,
    darkIcon: StakeIcon,
    activeDarkIcon: StakeDarkActiveIcon,
  },
];
