import { useState } from 'react';
import { User } from '../../../../models/user'
import './index.css'

interface Prop {
    user : User
    users: User[]
    setUsers : (newUsers: User[]) => void;
}

const ContainerCard: React.FC<Prop> = ({user, setUsers, users}) => {
    const [open, setOpen] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [permissions, setPermissions] = useState<string>('')
    const permissionRename = ()=>{
        if (user.permissions === 'x'){
            return "execute"
        }else if (user.permissions === 'w'){
            return "write"
        }
        return "read"
    }

    const edit_user = async() =>{

    }
    
  return (
    <>
    <div className='user-card'>
        <div className="content">
       <span className='label'>Username: </span> <span className='label'>{user.username}</span>
       </div>
       <div className="content">
       <span className='label'>Password: </span> <span className='label'>{user.password}</span>
       </div>
       <div className="content">
       <span className='label'>Permission: </span> <span className='label'>{permissionRename()}</span>
       </div>
       <div className="content">
       <span className='label'>Admin: </span> <span className='label'>{user.isAdmin ? "true": "false"}</span>
       </div>
       <div className="content">
       <button className='btn' onClick={()=>setOpen(true)}>Edit</button>
       {!user.isAdmin&&<button className='btn' >Delete</button>}
       </div>
    </div>
    <div className="popup-overlay" id="popupOverlay" style={open ? {"display":"block"}: {"display":"none"}} >

<div className="popup" id="popup">

    <span className="close" id="closePopup" onClick={()=> setOpen(false)}>&times;</span>

    <div className="popup-content">

        <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <input type="text" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <input type='text' placeholder='Permission' value={permissions} onChange={(e)=> setPermissions(e.target.value)} />
        <p>x -execute | w -write | r -read</p>
        <button className='submit' onClick={edit_user}>Submit</button>
    </div>

</div>

</div>
    </>
  )
}

export default ContainerCard