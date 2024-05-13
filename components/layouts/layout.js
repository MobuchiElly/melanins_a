import Navbar from './navbar.js';
import Footer from './footer.js';

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