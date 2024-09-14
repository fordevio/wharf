import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
  <>
  <Toaster/>
  <Routes >

  <Route path='/' element={<Home/>} />
  <Route path='/login' element={<Login/>} />

  </Routes>

  
  </>
  );
}

export default App;
