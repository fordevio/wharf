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
import wharfLogo from '../../assets/wharf.png';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GetUserRes } from '../../models/user';
import { getUser } from '../../api/user';
import { useQuery } from 'react-query';

const Navbar = () => {
  const [user, setUser] = useState<GetUserRes | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <img src={wharfLogo} className="logo" alt="wharf" />

      <div
        className={`menu ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? 'open' : ''}>
        <li>
          <Link
            to="/"
            className="link"
            style={currentPath === '/' ? { color: 'blue' } : {}}
          >
            Containers
          </Link>
        </li>
        <li>
          <Link
            to="/images"
            className="link"
            style={currentPath === '/images' ? { color: 'blue' } : {}}
          >
            Images
          </Link>
        </li>
        <li>
          <Link
            to="/volumes"
            className="link"
            style={currentPath === '/volumes' ? { color: 'blue' } : {}}
          >
            Volumes
          </Link>
        </li>
        <li>
          <Link
            to="/networks"
            className="link"
            style={currentPath === '/networks' ? { color: 'blue' } : {}}
          >
            Networks
          </Link>
        </li>
        {user.isAdmin && (
          <li>
            <Link
              to="/users"
              className="link"
              style={currentPath === '/users' ? { color: 'blue' } : {}}
            >
              Users
            </Link>
          </li>
        )}
      </ul>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
