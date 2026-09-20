import { Outlet } from "react-router-dom";
import Header from "./ui/Header";
import Footer from "./ui/Footer";

function Layout() {
  return (
    <div className="app">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
