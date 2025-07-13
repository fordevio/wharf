import { useState } from 'react';
import { DockerContainer } from '../../../models/container';
import { Image } from '../../../models/image';
import './index.css';
import { Volume } from '../../../models/volume';
import { NetworkResource } from '../../../models/network';
import { getAllContainers } from '../../../api/container';
import { getAllImages } from '../../../api/image';
import { getAllVolumes } from '../../../api/volume';
import { getAllNetworks } from '../../../api/network';
import { useQuery } from 'react-query';
import { Repeat } from 'lucide-react'


const Home = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [networks, setNetworks] = useState<NetworkResource[]>([]);

  const fetchInfo = async()=>{
    try{
      const res = await getAllContainers(localStorage.getItem('token') as string);
      setContainers(res.data);
    }catch(e) {
      console.log(e);
    }
    try{
      const res = await getAllImages(localStorage.getItem('token') as string);
      setImages(res.data);
    }catch(e) {
      console.log(e);
    }
    try{
      const res = await getAllVolumes(localStorage.getItem('token') as string);
      setVolumes(res.data);
    }catch(e) {
      console.log(e);
    }
    try{
      const res = await getAllNetworks(localStorage.getItem('token') as string);
      setNetworks(res.data);
    }catch(e) {
      console.log(e);
    }

  }

  useQuery('home-info', fetchInfo, {
    retry: false,
  });

  return (
    <div className='page'>
     <div className='hm-hd-div'>
      <span className='hm-hd'>Docker Management</span>
       <Repeat size={29} className='hd-icon'/>
     </div>

     <div className='hm-cards'>

      <div className='hm-card'>
         
      </div>
     </div>
     
    </div>
  )
}

export default Home