import '@/assets/scss/medio.scss';
import '@/assets/scss/style-email.scss';
import '@/assets/css/global.css';
import '@/assets/css/prime-react.css';
import { PrimeReactProvider } from 'primereact/api';
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Layout from '@/layout/Index';
import { SnackBar } from '@/components';
import { PrivateRoute } from '@/context/auth-context';
import { GoogleTagManager } from '@next/third-parties/google';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page : any) => <Layout title={''}>{page}</Layout>);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <AuthProvider> */}
          <PrivateRoute>
            <PrimeReactProvider>
              <SnackBar />
              {getLayout(<Component {...pageProps} />)}
              <GoogleTagManager gtmId={process.env.GTM_ID} />
            </PrimeReactProvider>
          </PrivateRoute> 
        {/* </AuthProvider> */}
      </PersistGate>
    </Provider>
  );
}
