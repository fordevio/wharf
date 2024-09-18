import React from 'react'
import { DockerContainer } from '../../../../models/container'
import './index.css'

interface Props {
    container: DockerContainer
}
const ContainerCard: React.FC<Props> = ({container}) => {
  const StateHandler = async()=>{
    console.log('state handler')
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
        <button className='btn' onClick={StateHandler}>{container.State==='running'?'Stop':'Start'}</button>
        <button className='btn'>Details</button>
        </div>
    </div>
  )
}

export default ContainerCard