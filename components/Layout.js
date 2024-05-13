import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";

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