import { BrowserRouter, Route, Routes } from "react-router-dom";
import Service from './components/service';
import ComingSoon from './components/coming-soon';
import Error from './components/404';
import Loadavailablity from './components/loadavailability';
import FuelPrice from "./components/FuelPrice";
import ProdductDetails from './components/product-details';
import BlogGrid from './components/blog-grid';
import BlogLeftSidebar from './components/blog-left-sidebar';
import BlogDetails from './components/blog-details';
import MyAccount from './components/my-account';
import Wishlist from './components/wishlist';
import { Toaster } from "react-hot-toast";
import Navbar from "./components/global-components/navbar";
import Footer from './components/global-components/footer';
import Profile from "./components/Profile";
import { ExpenseCalculator } from "./components/ExpenseCalculator";
import ExpenseDetails from "./components/ExpenseDetails";
import TollCalculator from "./components/TollCalculator";
import ChatView from "./components/Chat/Chat";
import TeamDetails from "./components/team-details";
import ContactV1 from "./components/contact";

function App() {

  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Service />} />
          <Route path="/my_profile" element={<Profile />} />
          <Route path="/load-availability" element={<Loadavailablity />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/product-details" element={<ProdductDetails />} />
          <Route path="/blog-grid" element={<BlogGrid />} />
          <Route path="/blog-left-sidebar" element={<BlogLeftSidebar />} />
          <Route path="/blog-details" element={<BlogDetails />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/toll-calculator" element={<TollCalculator />} />
          <Route path="/team-details" element={<TeamDetails />} />
          <Route path="/expense-calculator" element={<ExpenseCalculator />} />
          <Route path="/expense-details/:id" element={<ExpenseDetails />} />
          <Route path="/fuelprice" element={<FuelPrice />} />
          <Route path="/chat" element={<ChatView />} /> 
          <Route path="/contact" element={<ContactV1 />} />
          <Route path="/wishlist" element={<Wishlist />}>
            <Route path="load" />
            <Route path="truck" />
            <Route path="driver" />
            <Route path="buy_sell" />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
