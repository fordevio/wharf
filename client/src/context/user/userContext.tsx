import { createContext } from 'react';
import { GetUserRes } from '../../models/user';

export interface UserContextType {
  curUser: GetUserRes | null;
  setCurUser: (user: GetUserRes) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;
