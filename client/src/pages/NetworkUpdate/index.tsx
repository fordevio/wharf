import './index.css';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { NetworkResource } from '../../models/network';
import { getAllNetworks, networkLabelsUpdate } from '../../api/network';

const NetworkUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [network, setNetwork] = useState<NetworkResource | undefined>(
    undefined
  );
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [labelKey, setLabelKey] = useState<string>('');
  const [labelValue, setLabelValue] = useState<string>('');

  const addLabel = () => {
    if (!labelKey.trim()) {
      toast.error('Label key is required');
      return;
    }

    if (!labelValue.trim()) {
      toast.error('Label value is required');
      return;
    }

    if (labels.hasOwnProperty(labelKey)) {
      toast.error('Label key already exists');
      return;
    }

    setLabels(prev => ({
      ...prev,
      [labelKey.trim()]: labelValue.trim(),
    }));

    setLabelKey('');
    setLabelValue('');
  };

  const removeLabel = (keyToRemove: string) => {
    setLabels(prev => {
      const { [keyToRemove]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addLabel();
    }
  };

  const update = async () => {
    if (!network) {
      return;
    }
    try {
      const res = await networkLabelsUpdate(
        localStorage.getItem('token') as string,
        network?.Id,
        labels
      );
      navigate('/network/' + res.data.Id);
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const handleSubmit = async () => {
    if (JSON.stringify(labels) === JSON.stringify(network?.Labels)) {
      toast.error('No changes made.');
      return;
    }
    toast.promise(update(), {
      loading: 'Updating network...',
      success: 'Network updated successfully',
      error: data => `Error updating network: ${data.error}`,
    });
  };

  const fetchNetwork = async () => {
    if (id === undefined || id === null) {
      return;
    }
    try {
      const res = await getAllNetworks(localStorage.getItem('token') as string);
      const netw = res.data.find((net: NetworkResource) => net.Id === id);
      if (!netw) {
        navigate('/networks');
        return;
      }
      setNetwork(netw);
      setLabels(netw.Labels);
    } catch (e) {
      console.log(e);
      return navigate('/network/' + id);
    }
  };

  useQuery('network' + id, fetchNetwork, {
    retry: false,
  });

  if (id === undefined || id === null) {
    return <></>;
  }

  return (
    <>
      <div className="container-update">
        <div className="back-button-container">
          <button
            className="btn back-button"
            onClick={() => window.history.back()}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
        <div>
          <div className="container-form">
            <div className="form-group">
              <h3>Labels</h3>
              <div className="label-inputs">
                <input
                  type="text"
                  className="form-input"
                  value={labelKey}
                  onChange={e => setLabelKey(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Label key"
                />
                <input
                  type="text"
                  className="form-input"
                  value={labelValue}
                  onChange={e => setLabelValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Label value"
                />
                <button type="button" className="add-btn" onClick={addLabel}>
                  Add
                </button>
              </div>

              <div className="labels-list">
                {Object.entries(labels).map(([key, value]) => (
                  <div key={key} className="label-item">
                    <span>
                      {key}: {value}
                    </span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeLabel(key)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="button" className="save-btn" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkUpdate;
