import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './Components/LogIn';
import Home from './Components/Home';
import Services from './Components/Services';
import MoreDetails from './Components/MoreDetails';
import Register from './Components/Register';
import UserProtectWrapper from './Components/userprotectedwrapper';
import Profile from './Components/profile';
import Logout from './Components/Logout';

const App = () => {
  return (
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
          <Route path='/profileUI' element={<UserProtectWrapper><Profile /></UserProtectWrapper>} />
          <Route path="/services" element={<Services />} />
          <Route path="/moredetails/:serviceId" element={<MoreDetails />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/login/register' element={<Register />} />
          <Route path='/home'
          element={ <Home /> } />
          {/* <Route path='/logout' element={
          <UserProtectedWrapper>
            <Logout />
          </UserProtectedWrapper>}></Route> */}
          <Route path='/*' element={<h1>404 Error</h1>} />
        </Routes>
      </div>
  );
};

export default App;
