import { Routes, Route } from 'react-router-dom';

import Footer from '../components/Footer';
import Header from '../components/Header';

import Auction from './auction';
import NewAuction from './auction-new';
import Home from './home';

const App = (): JSX.Element => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/auction/new"
          element={<NewAuction />}
        />
        <Route
          path="/auction/:address"
          element={<Auction />}
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
