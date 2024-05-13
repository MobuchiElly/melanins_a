import Navbar from "./Navbar";
import Footer from './Footer';

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