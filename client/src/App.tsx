import React from 'react';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';


function App() {
  return (
  <>
  <Routes >

  <Route path='/' element={<Home/>} />
    <Route path='/login' element={<Login/>} />

  </Routes>

  
  </>
  );
}

export default App;
