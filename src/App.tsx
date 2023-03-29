import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import 'styles/index.css';
import routes from 'routes/route';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useEagerConnect, useInactiveListener } from 'hooks';
import Layout from 'components/Layout/Layout';
import { ColorModeContext, themeConfig } from './theme';
import { useWindowClose } from 'hooks/useWindowClose';

const App: React.FC<any> = () => {
  const { connector } = useWeb3React<Web3Provider>();
  const triedEager = useEagerConnect();
  const defaultTheme = localStorage.getItem('themeMode') || 'light';

  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  const [mode, setMode] = React.useState<'light' | 'dark' | any>(defaultTheme);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useInactiveListener(!triedEager || !!activatingConnector);
  useWindowClose();

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(defaultTheme === 'light' ? 'dark' : 'light');
        localStorage.setItem('themeMode', defaultTheme === 'light' ? 'dark' : 'light');
      },
    }),
    [mode],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          ...themeConfig.palette,
          mode: mode,
        },
      }),
    [mode],
  );

  return (
    <React.Suspense fallback={<div>....Loading</div>}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Layout>
            <Switch>
              {Object.keys(routes).map((key) => {
                //@ts-ignore
                const route = routes[key];
                return <route.route key={route.path} {...route} />;
              })}
              <Route path="*" />
            </Switch>
          </Layout>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </React.Suspense>
  );
};

export default App;
