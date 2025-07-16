import { useState } from 'react';
import { DockerContainer } from '../../../models/container';
import { Image } from '../../../models/image';
import './index.css';
import { Volume } from '../../../models/volume';
import containerIcon from '../../../assets/common/container.png';
import volumeIcon from '../../../assets/common/volume.png';
import imageIcon from '../../../assets/common/image.png';
import networkIcon from '../../../assets/common/network.png';
import { NetworkResource } from '../../../models/network';
import { getAllContainers } from '../../../api/container';
import { getAllImages } from '../../../api/image';
import { getAllVolumes } from '../../../api/volume';
import { getAllNetworks } from '../../../api/network';
import { useQuery } from 'react-query';
import { Repeat, Power, ChartPie } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatBytes } from '../../../utils/util';

const Home = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [networks, setNetworks] = useState<NetworkResource[]>([]);

  const getRunningContainers = () => {
    return containers.filter(container => container.State === 'running').length;
  };

  const getExitedContainers = () => {
    return containers.filter(container => container.State === 'exited').length;
  };

  const getTotalImageSize = () => {
    return images.reduce((total, image) => total + (image.Size || 0), 0);
  };

  const fetchInfo = async () => {
    try {
      const res = await getAllContainers(
        localStorage.getItem('token') as string
      );
      setContainers(res.data);
    } catch (e) {
      console.log(e);
    }
    try {
      const res = await getAllImages(localStorage.getItem('token') as string);
      setImages(res.data);
    } catch (e) {
      console.log(e);
    }
    try {
      const res = await getAllVolumes(localStorage.getItem('token') as string);
      setVolumes(res.data);
    } catch (e) {
      console.log(e);
    }
    try {
      const res = await getAllNetworks(localStorage.getItem('token') as string);
      setNetworks(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useQuery('home-info', fetchInfo, {
    retry: false,
  });

  return (
    <div className="page">
      <div className="hm-hd-div">
        <span className="hm-hd">Docker Management</span>
        <Repeat size={29} className="hd-icon" />
      </div>

      <div className="hm-cards">
        <div className="hm-card" onClick={() => navigate('/containers')}>
          <div className="hm-card-content">
            <div className="hm-card-icon-div">
              <img src={containerIcon} alt="" className="hm-card-icon" />
            </div>
            <span className="hm-card-sp">{containers.length}</span>
            <span className="hm-card-sp">Containers</span>
          </div>
          <div className="hm-card-sub">
            <span className="hm-card-sub-sp">
              <Power size={24} color="green" className="power" />
              {getRunningContainers()} running
            </span>
            <span className="hm-card-sub-sp">
              <Power size={24} color="red" className="power" />
              {getExitedContainers()} exited
            </span>
          </div>
        </div>
        <div className="hm-card" onClick={() => navigate('/images')}>
          <div className="hm-card-content">
            <div className="hm-card-icon-div">
              <img src={imageIcon} alt="" className="hm-card-icon" />
            </div>
            <span className="hm-card-sp">{images.length}</span>
            <span className="hm-card-sp">Images</span>
          </div>
          <div className="hm-card-sub">
            <span className="hm-card-sub-sp">
              <ChartPie size={24} color="#2F88FF" className="power" />
              {formatBytes(getTotalImageSize())}
            </span>
          </div>
        </div>
        <div className="hm-card" onClick={() => navigate('/volumes')}>
          <div className="hm-card-content">
            <div className="hm-card-icon-div">
              <img src={volumeIcon} alt="" className="hm-card-icon" />
            </div>
            <span className="hm-card-sp">{volumes.length}</span>
            <span className="hm-card-sp">Volumes</span>
          </div>
        </div>
        <div className="hm-card" onClick={() => navigate('/networks')}>
          <div className="hm-card-content">
            <div className="hm-card-icon-div">
              <img src={networkIcon} alt="" className="hm-card-icon" />
            </div>
            <span className="hm-card-sp">{networks.length}</span>
            <span className="hm-card-sp">Networks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
