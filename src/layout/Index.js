/* eslint-disable no-unused-vars */
import { Sidebar, Header, Head, Footer } from '@/components';
import AppRoot from './global/AppRoot';
import AppMain from './global/AppMain';
import AppWrap from '../components/template/header/dropdown/AppWrap';
import Content from '@/layout/content/Content';
import ThemeProvider from '@/layout/provider/Theme';

const Layout = ({ title, children, ...props }) => {
  return (
    <>
      <Head title={title || 'bebas kirim'} />
      <ThemeProvider>
        <AppRoot>
          <AppMain>
            <Sidebar fixed />
            <AppWrap>
              <Header fixed />
              <Content>
                <main>{children}</main>
              </Content>
              <Footer />
            </AppWrap>
          </AppMain>
        </AppRoot>
      </ThemeProvider>
    </>
  );
};
export default Layout;
