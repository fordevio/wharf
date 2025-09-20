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
import { User } from '../../../../models/user';
import './index.css';
import { deleteUser, updateUser } from '../../../../api/user';
import toast from 'react-hot-toast';
import { Trash, Pencil, Eye, EyeOff } from 'lucide-react';

interface Prop {
  user: User;
  users: User[];
  setUsers: (newUsers: User[]) => void;
}

const UserCard: React.FC<Prop> = ({ user, setUsers, users }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(user.username);
  const [password, setPassword] = useState<string>(user.password);
  const [permissions, setPermissions] = useState<string>(user.permissions);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const permissionRename = () => {
    if (user.permissions === 'x') {
      return 'execute';
    } else if (user.permissions === 'w') {
      return 'write';
    }
    return 'read';
  };

  const deleteFunc = async () => {
    try {
      await deleteUser(localStorage.getItem('token') as string, user.id);
      const newUsers = users.filter(u => u.id !== user.id);
      setUsers(newUsers);
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const delete_handler = async () => {
    toast.promise(deleteFunc(), {
      loading: 'Deleting...',
      success: 'User deleted',
      error: data => data.error,
    });
  };

  const editFunc = async () => {
    try {
      const res = await updateUser(
        localStorage.getItem('token') as string,
        user.id,
        username,
        permissions,
        password
      );
      const newUsers = users.map(u => {
        if (u.id === user.id) {
          return res.data;
        }
        return u;
      });
      setUsers(newUsers);
      setOpen(false);
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };
  const edit_user = async () => {
    if (username === '' || password === '' || permissions === '') {
      toast.error('All fields are required');
      return;
    }
    if (permissions !== 'x' && permissions !== 'w' && permissions !== 'r') {
      toast.error('Invalid permission');
      return;
    }
    toast.promise(editFunc(), {
      loading: 'Updating...',
      success: 'User updated',
      error: data => data.error,
    });
  };

  return (
    <>
      <tr key={user.id}>
        <td>{user.username}</td>
        <td>{showPassword?user.password:"************"} {showPassword?<EyeOff  onClick={()=>setShowPassword(false)} style={{cursor: "pointer"}}/>:<Eye  onClick={()=>setShowPassword(true)} style={{cursor: "pointer"}}/>}</td>
        <td>{permissionRename()}</td>
        <td>{user.isAdmin ? 'true' : 'false'}</td>
        <td>
          <div className="us-tb-buts">
            <button className="tb-btn" onClick={() => setOpen(true)}>
              {' '}
              <Pencil className="btn-logo" size={15} /> Edit
            </button>
            {!user.isAdmin && (
              <button
                className="tb-btn"
                style={{ background: '#B11010' }}
                onClick={delete_handler}
              >
                <Trash className="btn-logo" size={15} /> Delete
              </button>
            )}
          </div>
        </td>
      </tr>

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
            <button className="submit" onClick={edit_user}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
