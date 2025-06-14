import { useState } from 'react';
import './index.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createVolume } from '../../api/volume';

const VolumeCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [labels, setLabels] = useState<Record<string, string> | undefined>(
    undefined
  );

  const create = async () => {
    try {
      const res = await createVolume(
        localStorage.getItem('token') as string,
        name,
        labels
      );
      return res.data;
    } catch (e: any) {
      throw e.response ? e.response.data : { error: 'Request failed' };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(create(), {
      loading: 'Creating container...',
      success: data => {
        setName('');
        setLabels(undefined);

        navigate('/volumes');
        return `Volume created successfully!`;
      },
      error: data => `Error creating volume: ${data.error}`,
    });
  };

  const handleLabelChange = (key: string, value: string) => {
    setLabels(prev => ({
      ...(prev || {}),
      [key]: value,
    }));
  };

  const handleLabelAdd = () => {
    setLabels(prev => ({
      ...(prev || {}),
      '': '',
    }));
  };

  const handleLabelDelete = (keyToRemove: string) => {
    setLabels(prev => {
      if (!prev) return prev;
      const newLabels = { ...prev };
      delete newLabels[keyToRemove];
      return Object.keys(newLabels).length > 0 ? newLabels : undefined;
    });
  };

  return (
    <>
      <div className="container-create">
        <div className="back-button-container">
          <button
            className="btn back-button"
            onClick={() => window.history.back()}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>

        <div className="">
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-4 max-w-2xl mx-auto"
            >
              <h2 className="text-xl font-bold">Container Create Request</h2>

              <label>Name*</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <div>
                <label>Labels</label>
                {labels &&
                  Object.entries(labels).map(([key, value], index) => (
                    <div
                      key={index}
                      style={{ display: 'flex', marginBottom: '4px' }}
                    >
                      <input
                        type="text"
                        placeholder="Key"
                        value={key}
                        onChange={e => {
                          const newKey = e.target.value;
                          setLabels(prev => {
                            if (!prev) return prev;
                            const newLabels = { ...prev };
                            const val = newLabels[key];
                            delete newLabels[key];
                            newLabels[newKey] = val;
                            return newLabels;
                          });
                        }}
                        style={{ marginRight: '8px' }}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={value}
                        onChange={e => handleLabelChange(key, e.target.value)}
                        style={{ marginRight: '8px' }}
                      />
                      <button onClick={() => handleLabelDelete(key)}>
                        Delete
                      </button>
                    </div>
                  ))}
                <button onClick={handleLabelAdd}>Add Label</button>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default VolumeCreate;
