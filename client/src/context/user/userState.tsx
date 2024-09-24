import { FC, ReactNode, useState } from 'react';
import UserContext from './userContext';
import { GetUserRes, User } from '../../models/user';

interface Props {
  children: ReactNode;
}

const UserState: FC<Props> = ({ children }) => {
  const [curUser, setCurUser] = useState<GetUserRes | null>(null);

  return (
    <UserContext.Provider value={{ curUser, setCurUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
