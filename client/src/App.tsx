import Login from './pages/Login';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'
import { Toaster } from 'react-hot-toast';
import { useContext, useEffect } from 'react';
import { getUser } from './api/user';
import UserContext from './context/user/userContext';
import Containers from './pages/Home/Containers';
import Imges from './pages/Home/Images';
import Volumes from './pages/Home/Volumes';
import Networks from './pages/Home/Networks';
import Users from './pages/Home/Users';
import ContainerDetail from './pages/Home/ContainerDetail';


function App() {

  const location = useLocation();
  const navigate= useNavigate()
  const userContext = useContext(UserContext);

  const currentPath = location.pathname;

  const isLogin= async()=>{
    const token = localStorage.getItem('token')
    if (token==null){
      if(currentPath!=='/login'){
        navigate('/login')
      }
      return
    }
     try{
       const res = await getUser(token)
       userContext?.setCurUser(res.data);
       if(currentPath==='/login'){
        navigate('/')
      }

     }catch(e){
      if(currentPath!=='/login'){
        navigate('/login')
      }
     }
  }

  useEffect(()=>{
     isLogin()
  },[])

  return (
  <>
  <Toaster/>
  <Routes >
  <Route path='/' element={<Home/>} >
  <Route index element={<Containers />} />
  <Route path='images' element={<Imges/>} />
  <Route path='volumes' element={<Volumes/>} />
  <Route path='networks' element={<Networks/>}/>
  <Route path='users' element ={<Users/>} />  
  <Route path='container/:id' element ={<ContainerDetail/>} />  
  </Route>
  <Route path='/login' element={<Login/>} />
  
  </Routes>

  
  </>
  );
}

export default App;
