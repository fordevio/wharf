import './index.css'
import wharfLogo from '../../assets/wharf.png'
import { useContext } from 'react';
import UserContext from '../../context/user/userContext';
import { Link, useLocation } from 'react-router-dom';
const Navbar = () => {

  const userContext = useContext(UserContext);
  
  const location = useLocation();
  const currentPath = location.pathname;

  if(userContext==null|| userContext.curUser == null){
        return <></>
  }

  return (
    <div className='nav' >

      <img src={wharfLogo} className = 'logo' alt='wharf' />
      <div className='nav-cont'>
        <div>
          <Link  to="/" className='link' style={currentPath==='/'?{color:'rgb(100, 30, 110)'}:{}}
          >Containers</Link>
        </div>
        <div>
          <Link to={"/images"} className='link' style={currentPath==='/images'?{color:'rgb(100, 30, 110)'}:{}}>Images</Link>
        </div>
        <div>
          <Link to={"/volumes"} className='link' style={currentPath==='/volumes'?{color:'rgb(100, 30, 110)'}:{}}>Volumes</Link>
        </div>
        <div>
          <Link to={"/networks"} className='link' style={currentPath==='/networks'?{color:'rgb(100, 30, 110)'}:{}}>Networks</Link>
        </div>
        {userContext.curUser.isAdmin===true&& <div>
          <Link to={"/users"} className='link' style={currentPath==='/users'?{color:'rgb(100, 30, 110)'}:{}}>Users</Link>
        </div>}
      </div>  
    </div>
  )
}

export default Navbar