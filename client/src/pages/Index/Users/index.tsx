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

import { useState } from 'react';
import { createUser, getAllUser } from '../../../api/user';
import { User } from '../../../models/user';
import './index.css';
import UserCard from './card';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import usIcon from '../../../assets/common/user.png';
import { Plus } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [permissions, setPermissions] = useState<string>('');
  const fetchUser = async () => {
    try {
      const res = await getAllUser(localStorage.getItem('token') as string);
      setUsers(res.data);
    } catch (e) {}
  };

  const addFunc = async () => {
    try {
      const res = await createUser(
        localStorage.getItem('token') as string,
        username,
        permissions,
        password
      );
      setUsers([...users, res.data]);
      setUsername('');
      setPassword('');
      setPermissions('');
      setOpen(false);
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const add_user = async () => {
    if (username === '' || password === '' || permissions === '') {
      return toast.error('Please fill all fields');
    }
    if (permissions !== 'x' && permissions !== 'w' && permissions !== 'r') {
      return toast.error('Invalid permission');
    }
    if (password.length < 8 || password.length > 20) {
      toast.error('Password must be between 8 and 20 characters');
      return;
    }

    // Check if it contains at least one letter and one number
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;

    const hasLetter = letterRegex.test(password);
    const hasNumber = numberRegex.test(password);

    if (!(hasLetter && hasNumber)) {
      toast.error('Password must contain at least one letter and one number');
      return;
    }
    toast.promise(addFunc(), {
      loading: 'Adding user...',
      success: 'User added',
      error: data => `${data.error}`,
    });
  };

  useQuery('users', fetchUser, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="page">
      <div className="us-det">
        <div className="us-det-h">
          <img src={usIcon} alt="" className="us-det-hd-img" />{' '}
          <span className="us-det-hd">Users</span>
          <div className="us-det-buts">
            <button
              className="det-btn del-btn"
              style={{ background: '#0099FF' }}
              onClick={() => setOpen(true)}
            >
              <Plus className="btn-logo" size={20} />
              Add
            </button>
          </div>
        </div>

        <table className="us-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>Permission</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  users={users}
                  setUsers={setUsers}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className="popup-overlay"
        id="popupOverlay"
        style={open ? { display: 'block' } : { display: 'none' }}
      >
        <div className="popup" id="popup">
          <span
            className="close"
            id="closePopup"
            onClick={() => setOpen(false)}
          >
            &times;
          </span>

          <div className="popup-content">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Permission"
              value={permissions}
              onChange={e => setPermissions(e.target.value)}
            />
            <p>x -execute | w -write | r -read</p>
            <button className="submit" onClick={add_user}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
