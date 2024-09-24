import { useState } from 'react';
import { User } from '../../../../models/user'
import './index.css'
import { deleteUser, updateUser } from '../../../../api/user';
import toast from 'react-hot-toast';

interface Prop {
    user : User
    users: User[]
    setUsers : (newUsers: User[]) => void;
}

const ContainerCard: React.FC<Prop> = ({user, setUsers, users}) => {
    const [open, setOpen] = useState<boolean>(false)
  const [username, setUsername] = useState<string>(user.username)
  const [password, setPassword] = useState<string>(user.password)
  const [permissions, setPermissions] = useState<string>(user.permissions)
    const permissionRename = ()=>{
        if (user.permissions === 'x'){
            return "execute"
        }else if (user.permissions === 'w'){
            return "write"
        }
        return "read"
    }

    const deleteFunc = async() =>{
        try{
            await deleteUser(localStorage.getItem('token') as string, user.id)
            const newUsers = users.filter((u)=> u.id !== user.id)
            setUsers(newUsers)
        }catch(e:any){
            throw e.response ? e.response.data : {error: "Request failed"}
        }
    }


    const delete_handler = async() =>{
        toast.promise(deleteFunc(), {
            loading: 'Deleting...',
            success: 'User deleted',
            error: (data) => data.error
        })
    }

    const editFunc = async() =>{
        try{
         
            const res = await updateUser(localStorage.getItem('token') as string, user.id, username, permissions, password)
            const newUsers = users.map((u)=>{
                if(u.id === user.id){
                    return res.data
                }
                return u
            })
            setUsers(newUsers)
            setOpen(false)
        }catch(e:any){
            throw e.response ? e.response.data : {error: "Request failed"}
        }
    }
    const edit_user = async() =>{
       if(username === "" || password === "" || permissions === ""){
           toast.error('All fields are required')
           return
       }
       if(permissions !== 'x' && permissions !== 'w' && permissions !== 'r'){
           toast.error('Invalid permission')
           return
       }
        toast.promise(editFunc(), {
            loading: 'Updating...',
            success: 'User updated',
            error: (data) => data.error})
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
       {!user.isAdmin&&<button className='btn' onClick={delete_handler} >Delete</button>}
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