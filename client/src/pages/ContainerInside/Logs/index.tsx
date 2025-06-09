import { useState } from 'react';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import { containerLogs } from '../../../api/container';
import { useQuery } from 'react-query';

const ContainerLogs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [logs, setLogs] = useState<string | null>(null);
  const fetchLogs = async () => {
    try {
      const res = await containerLogs(
        localStorage.getItem('token') as string,
        id as string
      );
      setLogs(res.data);
    } catch (e) {
      console.log(e);
      return navigate('/');
    }
  };

  useQuery('container' + id, fetchLogs, {
    retry: false,
  });

  if (id === undefined) {
    return <></>;
  }

  return (
    <>
      <div className="con-stats-det">
        <div className="stats">
          <div className="title">Logs</div>
          <div className="stats-container">
            {logs ? (
              <div className="stats-data">{logs}</div>
            ) : (
              <div className="loading">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerLogs;
