import routesConst from 'routes/routes-const';
import PrivateRoute from 'routes/privateRoute';
import Dashboard from 'pages/Dashboard/Dashboard';
import MintContract from 'pages/MintContract';
import MyContract from 'pages/MyContract';
import Treasury from 'pages/Treasury';
import SwapPage from 'pages/Swap';
import ZapPage from 'pages/Zap';
import StakePage from 'pages/Stake';

const routers = {
  dashboard: {
    exact: true,
    path: routesConst.DASHBOARD,
    component: Dashboard,
    route: PrivateRoute,
  },
  mintContract: {
    exact: true,
    path: routesConst.MINT_CONTRACT,
    component: MintContract,
    route: PrivateRoute,
  },
  myContract: {
    exact: true,
    path: routesConst.MY_CONTRACT,
    component: MyContract,
    route: PrivateRoute,
  },
  treasury: {
    exact: true,
    path: routesConst.TREASURY,
    component: Treasury,
    route: PrivateRoute,
  },
  swap: {
    exact: true,
    path: routesConst.SWAP,
    component: SwapPage,
    route: PrivateRoute,
  },
  stake: {
    exact: true,
    path: routesConst.STAKE,
    component: StakePage,
    route: PrivateRoute,
  },
  zap: {
    exact: true,
    path: routesConst.ZAP,
    component: ZapPage,
    route: PrivateRoute,
  },
};

export default routers;
