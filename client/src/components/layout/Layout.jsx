import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow relative" style={{ zIndex: 0, contain: 'layout paint', isolation: 'isolate' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
