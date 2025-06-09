import { useState } from 'react';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { containerStats } from '../../../api/container';
import { useQuery } from 'react-query';

const ContainerStats = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stats, setStats] = useState<string | null>(null);
  const fetchStats = async () => {
    try {
      const res = await containerStats(
        localStorage.getItem('token') as string,
        id as string
      );
      setStats(res.data);
    } catch (e) {
      console.log(e);
      return navigate('/');
    }
  };

  useQuery('container' + id, fetchStats, {
    retry: false,
  });

  if (id === undefined) {
    return <></>;
  }

  return (
    <>
      <div className="con-stats-det">
        <div className="stats">
          <div className="title">Stats</div>
          <div className="stats-container">
            {stats ? (
              <div className="stats-data">{stats}</div>
            ) : (
              <div className="loading">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerStats;
