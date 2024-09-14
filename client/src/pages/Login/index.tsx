
import { useEffect, useState } from 'react'
import wharfLogo from '../../assets/wharf.png'
import './index.css'
import { isAdminAvailable } from '../../api/login'
import toast from 'react-hot-toast'



const Login = () => {
  
  const [isAdmin, setIsAdmin]= useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [initPassword, setInitPassword]= useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword]= useState<string>('')

  const findIsAdmin= async() =>{
      try{
         const res = await isAdminAvailable()
         if (res.data.username){
            setIsAdmin(true)
            return
         }  
      }catch(e){}
      setIsAdmin(false)
  }

  useEffect(() => {
     findIsAdmin()
  }, [])

  const SubmitHandler= async()=>{
   if(username===''||password===''||confirmPassword===''){
      if(!isAdmin&&initPassword===''){
         toast.error('Please fill all fields')
         return
      }

      toast.error('Please fill all fields')
      return
   }

   if (password.length < 8 || password.length > 20) {
      toast.error('Password must be between 8 and 20 characters')
      return 
    }
  
    // Check if it contains at least one letter and one number
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
  
    const hasLetter = letterRegex.test(password);
    const hasNumber = numberRegex.test(password);
  
   if (!(hasLetter && hasNumber)) {
     toast.error('Password must contain at least one letter and one number')
     return
   }

   if(password!==confirmPassword){
      toast.error('Passwords do not match confirm password')
      return
   }
   
  }

  return (
    <>

    <div className='logoDiv'>
        <img src={wharfLogo} alt='Wharf Logo' className='wharfLogo'/>
    </div>
    <div className='loginDiv'>
         <div className='iDiv'>
            <p className='loginH'>{isAdmin?'Login':'Register'}</p>
          {!isAdmin&& <div className='inputDiv'>
           
           <span className='label'>Init-Password</span>
           <input type='text' onChange={(e)=>setInitPassword(e.target.value)} value={initPassword}/>
           <p className='p'>Init-Password can be found in /var/lib/wharf/wharf.txt</p>
          </div>}
           <div className='inputDiv'>
            <span className='label'>Username</span>
            <input onChange={(e)=>setUsername(e.target.value)} type='text' value={username}/>
           </div>
           <div className='inputDiv'>
            <span className='label'>Password</span>
            <input type='password'  onChange={(e)=>setPassword(e.target.value)} value={password}/>
            </div>
            <div className='inputDiv'>
            <span className='label'>Confirm Password</span>
            <input type='password' onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword}/>
            </div>
           <button onClick={SubmitHandler}>Submit</button>
        </div>
    </div>
    </>
  )
}

export default Login