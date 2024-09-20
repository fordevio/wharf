import React, { useEffect, useState } from 'react'
import { DockerContainer } from '../../../../models/container'
import './index.css'
import { getAllContainers, pauseContainer, startContainer, stopContainer, unpauseContainer } from '../../../../api/container'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

interface Props {
    containerId: string
}

const ContainerCard: React.FC<Props> = ({containerId}) => {
  const [container, setContainer]= useState<DockerContainer| null>(null)

  const fetchContainer = async () => {
    try{
      const res = await getAllContainers(localStorage.getItem('token') as string)
      res.data.forEach((cont)=>{  
        if(cont.Id===containerId){
          setContainer(cont)
        }
      }) 
    }catch(e){
      console.log(e)  
    }
  }
 
 

  const stopStartFunc = async()=>{
    const token = localStorage.getItem('token') as string
    
    try{
      if(container==null){
        return {message: "Container not found"}
      }
      let res
      if(container.State==='exited'){
         res = await startContainer(token, container.Id)
        
        
      }else{
        res = await stopContainer(token, container.Id)
      }
      return res.data
    }catch(e:any){
      throw e.response ? e.response.data : {error: "Request failed"}
    }
  }

  const pauseUnpauseFunc = async()=>{
    
    const token = localStorage.getItem('token') as string
    try{
      if(container==null){
        return {message: "Container not found"}
      }

      let res
      if(container.State==='paused'){
         res = await unpauseContainer(token, container.Id)
        
        
      }else{
        res = await pauseContainer(token, container.Id)
      }
      
      return res.data
    }catch(e:any){
      throw e.response ? e.response.data : {error: "Request failed"}
  }
  
}


  const StartStopHandler = async()=>{
    if(container==null){
      return 
    }
    toast.promise(
      stopStartFunc(),
       {
         loading: 'Processing...',
         success: (data) => `${data.message.replace(container.Id, '').trim()}`,
         error:(data) => `${data.error}`,
       }
     );    
     
  }

  const PauseUnpauseHandler = async()=>{
    if(container==null){
      return 
    }
    toast.promise(
      pauseUnpauseFunc(),
       {
         loading: 'Processing...',
         success: (data) => `${data.message.replace(container.Id, '').trim()}`,
         error:(data) => `${data.error}`,
       }
     );
    
  }

  useEffect(()=>{
    fetchContainer()
  }  ,[])

  if (container==null){
    return <></>
  }

  return (
    <div className='cont-card'>
        <p className='name'>{container.Names[0].replace(/^\//, "")}</p>
       <div className="content">
       <span className='label'>Image: </span> <span className='label'>{container.Image.split('@')[0]}</span>
       </div>
       <div className="content">
       <span className='label'>Status: </span> <span className='label'>{container.Status}</span>
       </div>
       <div className="content">
       <span className='label'>State: </span> <span className='label' style={container.State==='running'?{'color':'green'}:{'color':'red'}}>{container.State}</span>
       </div>
       <div className="content">
       <button className='btn' onClick={StartStopHandler}>{container.State==='exited'?'Start':'Stop'}</button>
       <button className='btn' onClick={PauseUnpauseHandler}>{container.State==='paused'?'Unpause':'Pause'}</button>
       <Link to={`/container/${container.Id}`} className='btn detail'>Details</Link>
       </div>
    </div>
  )
}

export default ContainerCard