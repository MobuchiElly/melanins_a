import Navbar from "./navbar";
import Footer from "./footer";
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