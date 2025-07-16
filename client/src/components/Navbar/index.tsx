// Copyright 2025 The wharf Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import './index.css';
import wharfLogo from '../../assets/wharf.svg';
import containerIcon from '../../assets/common/container.png';
import imageIcon from '../../assets/common/image.png';
import volumeIcon from '../../assets/common/volume.png';
import networkIcon from '../../assets/common/network.png';
import userIcon from '../../assets/common/user.png';
import homeIcon from '../../assets/common/home.png';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GetUserRes } from '../../models/user';
import { getUser } from '../../api/user';
import { useQuery } from 'react-query';

const Navbar = () => {
  const [user, setUser] = useState<GetUserRes | null>(null);

  const location = useLocation();
  const currentPath = location.pathname;

  const fetchUser = async () => {
    try {
      const res = await getUser(localStorage.getItem('token') as string);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useQuery('cur-user', fetchUser, {
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };

  if (!user) {
    return <></>;
  }

  return (
    <nav className="nav">
      <div className="logo-div">
        <img src={wharfLogo} className="nav-logo" alt="wharf" />
        <p className="nav-logo-text">Wharf</p>
      </div>

      <div className="nav-links">
        <div
          className="link-div"
          style={
            currentPath === '/'
              ? { backgroundColor: '#051D2D', borderColor: '#0099FF' }
              : {}
          }
        >
          <img src={homeIcon} alt="" className="nav-icon" />
          <Link to="/" className="link-paths">
            Home
          </Link>
        </div>
        <div
          className="link-div"
          style={
            currentPath === '/containers'
              ? { backgroundColor: '#051D2D', borderColor: '#0099FF' }
              : {}
          }
        >
          <img src={containerIcon} alt="" className="nav-icon" />
          <Link to="/containers" className="link-paths">
            Containers
          </Link>
        </div>
        <div
          className="link-div"
          style={
            currentPath === '/images'
              ? { backgroundColor: '#051D2D', borderColor: '#0099FF' }
              : {}
          }
        >
          <img src={imageIcon} alt="" className="nav-icon" />
          <Link to="/images" className="link-paths">
            Images
          </Link>
        </div>
        <div
          className="link-div"
          style={
            currentPath === '/volumes'
              ? { backgroundColor: '#051D2D', borderColor: '#0099FF' }
              : {}
          }
        >
          <img src={volumeIcon} alt="" className="nav-icon" />
          <Link to="/volumes" className="link-paths">
            Volumes
          </Link>
        </div>
        <div
          className="link-div"
          style={
            currentPath === '/networks'
              ? { backgroundColor: '#051D2D', borderColor: '#0099FF' }
              : {}
          }
        >
          <img src={networkIcon} alt="" className="nav-icon" />
          <Link to="/networks" className="link-paths">
            Networks
          </Link>
        </div>
        {user.isAdmin && (
          <div
            className="link-div"
            style={
              currentPath === '/users'
                ? { backgroundColor: '#051D2D', borderColor: '#0099FF' }
                : {}
            }
          >
            <img src={userIcon} alt="" className="nav-icon" />
            <Link to="/users" className="link-paths">
              Users
            </Link>
          </div>
        )}
      </div>
      <button className=" logout-btn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
