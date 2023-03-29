import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'App';
import reportWebVitals from 'reportWebVitals';
import store from 'stores/store';
import { ToastContainer } from 'react-toastify';
import 'assets/fonts/stylesheet.css';
import 'react-toastify/dist/ReactToastify.css';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createClient } from 'urql';
import { Provider as ProviderURQL } from 'urql';
import { BrowserRouter as Router } from 'react-router-dom';

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const Web3ReactNetWokProvider = createWeb3ReactRoot('NETWORK');

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_URL,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const client = createClient({
  url: process.env.REACT_APP_GRAPH_API_URL || '',
});

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactNetWokProvider getLibrary={getLibrary}>
        <Router>
          <React.StrictMode>
            <ProviderURQL value={client}>
              <App />
            </ProviderURQL>
            <ToastContainer pauseOnHover={false} newestOnTop={true} autoClose={3000} limit={1} />
          </React.StrictMode>
        </Router>
      </Web3ReactNetWokProvider>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
