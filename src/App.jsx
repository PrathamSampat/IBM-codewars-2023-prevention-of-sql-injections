import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import RestrictedAuth from './Components/RestrictedAuth';
import Register from './Components/Register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/login' element={<Login />} />
          {/* <Route element={<RestrictedAuth />}> */}
          <Route path='/dashboard' element={<Dashboard />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>

      {/* <Login /> */}
    </div>
  );
}

export default App;
