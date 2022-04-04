import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/main';
import Home from './views/home';
import Allins from './views/allins';
import Allin from './views/allin';

function App() {

  return (
    <MainLayout>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/allins" exact element={<Allins/>} />
        <Route path="/allins/:tokenId" exact element={<Allin/>} />
      </Routes>
    </MainLayout>
  );
}

export default App;
