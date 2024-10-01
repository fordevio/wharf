import { useNavigate, useParams } from 'react-router-dom';
import './index.css'
import { DockerContainer } from '../../../models/container';
import { useState } from 'react';
import { getAllContainers } from '../../../api/container';
import { useQuery } from 'react-query';
import { convertToIndianDateTime } from '../../../utils/util';

const ContainerDetail = () => {
  
  const [container, setContainer] = useState<DockerContainer | null>(null);
  const navigate = useNavigate()
  const {id} = useParams()  

  const fetchContainer = async() =>{
    try{
      const containers =  await getAllContainers(localStorage.getItem('token') as string);
      let s =0
      containers.data.forEach(cont => {
        if(cont.Id === id){
          console.log(cont)
          setContainer(cont);
          s=1;
          return;
        }
        
      });
      if(s===0){
        navigate('/')
      }
      
    }catch(e){
      console.log(e)
      return navigate('/')
    }
  }

  useQuery('container'+id, fetchContainer, {
    retry: false,
  });
  
  if(container === null){
    return <div>Loading...</div>
  }
  return <>
  <div className='container-det'>
   <div className='cont-div'>
    <span className='cont sp'>Name: </span>  <span className='cont'> {container.Names[0].replace(/^\//, '')}</span>
   </div>
   <div className='cont-div'>
    <span className='cont sp'>Image: </span>  <span className='cont'> {container.Image.split('@')[0]}</span>
   </div>
   <div className='cont-div pad'>
    <span className='cont-l sp'>Status: </span>  <span className='cont-l'> {container.Status}</span>
   </div>
   <div className='cont-div '>
    <span className='cont-l sp'>State: </span>  <span className='cont-l'  style={
            container.State === 'running'
              ? { color: 'green' }
              : { color: 'red' }
          }> {container.State}</span>
   </div>
   <div className='cont-div pad'>
    <span className='cont-l sp'>Created At: </span>  <span className='cont-l'> {convertToIndianDateTime(container.Created)}</span>
   </div>
   <div className='cont-div pad'>
    <span className='cont-l sp'>Command: </span>  <span className='cont-l'> {container.Command}</span>
   </div>
   <div className='cont-div pad'>
    <span className='cont-l sp'>Labels: </span>  
    <div className="lab">
    {
      Object.entries(container.Labels).map(([key, value]) => { return <p className='cont-l'> {key} : {value}</p> })
    }
    </div>
   </div>
   <div className="">
   <button className='btn del-btn' onClick={()=>{}}>Delete</button>
   <button className='btn' onClick={()=>{}}>Edit Name</button>
   </div>
  </div>
  </>
};

export default ContainerDetail;
