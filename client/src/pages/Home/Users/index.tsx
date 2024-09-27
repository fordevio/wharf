import { useEffect, useState } from 'react';
import { createUser, getAllUser } from '../../../api/user';
import { User } from '../../../models/user';
import './index.css';
import ContainerCard from './card';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="user-page">
      <div className="func">
        <button className="btn" onClick={() => setOpen(true)}>
          Add User
        </button>
      </div>
      <div className="users-cont">
        {users.map(user => {
          return (
            <ContainerCard
              key={user.id}
              user={user}
              users={users}
              setUsers={setUsers}
            />
          );
        })}
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
