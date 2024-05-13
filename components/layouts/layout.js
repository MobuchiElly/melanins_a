import Navbar from './Navbar.js';
import Footer from './Footer.js';

const Layout = ({children}) => {
  return (
    <>
      <Navbar/>
      <main className="mt-24">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;