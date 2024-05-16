import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({children}) => {
  return (
    <>
      <Navbar/>
      <main className="bg-gradient-to-b from-slate-100 to-slate-200">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
