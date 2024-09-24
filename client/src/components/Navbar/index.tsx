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
          <Link  to="/" className='link' style={currentPath==='/'?{color:'blue'}:{}}
          >Containers</Link>
        </div>
        <div>
          <Link to={"/images"} className='link' style={currentPath==='/images'?{color:'blue'}:{}}>Images</Link>
        </div>
        <div>
          <Link to={"/volumes"} className='link' style={currentPath==='/volumes'?{color:'blue'}:{}}>Volumes</Link>
        </div>
        <div>
          <Link to={"/networks"} className='link' style={currentPath==='/networks'?{color:'blue'}:{}}>Networks</Link>
        </div>
        {userContext.curUser.isAdmin===true&& <div>
          <Link to={"/users"} className='link' style={currentPath==='/users'?{color:'blue'}:{}}>Users</Link>
        </div>}
      </div>  
    </div>
  )
}

export default Navbar