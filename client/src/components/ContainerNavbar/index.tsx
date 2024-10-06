import './index.css';
import wharfLogo from '../../assets/wharf.png';
import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

interface Props {
  id: string;
}

const ContainerNavbar: React.FC<Props> = ({ id }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [navVisible, setNavVisible] = useState(false);

  const toggleNav = () => {
    setNavVisible(!navVisible);
  };

  return (
    <div className="nav">
      <button className="nav-button" onClick={toggleNav}>
        <img src={wharfLogo} className="logo" alt="wharf" />
      </button>
      <div className={`nav-cont ${navVisible ? 'show' : ''}`}>
        {navVisible && (
          <button className="close-button" onClick={toggleNav}>
            x
          </button>
        )}
        <div>
          <Link
            to="/"
            className="link"
            style={currentPath === '/' ? { color: 'blue' } : {}}
          >
            Home
          </Link>
        </div>
        <div>
          <Link
            to={`/container/${id}`}
            className="link"
            style={currentPath === '/container/' + id ? { color: 'blue' } : {}}
          >
            Container-Details
          </Link>
        </div>
        <div>
          <Link
            to={`/container/${id}/networks`}
            className="link"
            style={
              currentPath === `/container/${id}/networks`
                ? { color: 'blue' }
                : {}
            }
          >
            Network-details
          </Link>
        </div>
        <div>
          <Link
            to={`/container/${id}/volumes`}
            className="link"
            style={
              currentPath === `/container/${id}/volumes`
                ? { color: 'blue' }
                : {}
            }
          >
            Volumes-details
          </Link>
        </div>
        <div>
          <Link
            to={`/container/${id}/stats`}
            className="link"
            style={
              currentPath === `/container/${id}/stats` ? { color: 'blue' } : {}
            }
          >
            Stats
          </Link>
        </div>
        <div>
          <Link
            to={`/container/${id}/logs`}
            className="link"
            style={
              currentPath === `/container/${id}/logs` ? { color: 'blue' } : {}
            }
          >
            Logs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContainerNavbar;
