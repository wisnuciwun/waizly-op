import { Head } from '@/components';

type LayoutProps = {
  title?: string;
  children?: React.ReactElement;
};

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head title={title || 'bebas kirim'} />
      <div className="nk-app-root">
        <div className="nk-wrap nk-wrap-nosidebar">
          <div className="nk-content">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
