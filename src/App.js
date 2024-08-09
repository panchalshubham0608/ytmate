import { useState } from 'react';
import './App.css';
import Loader from './Loader';
import { download, extractVideoId, fetchVideoInfo } from './utils';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [videoInfo, setVideoInfo] = useState(null);

  const showVideoInfo = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // validate url
    if (!url) return;    
    let id = extractVideoId(url);
    if (!id) {
      setError("That does't look like a valid YouTube URL. Try again!");
      return;
    }

    // fetch preview information
    setVideoInfo(null);
    setError('');
    setLoading(true);
    fetchVideoInfo(id).then(info => {
      setVideoInfo(info);
    }).catch(err => {
      console.log(err);
      setError("Failed to fetch preview for this url. Please check your url.");
    }).finally(() => {
      setLoading(false);
    });
  };

  // Utility function to initiate the download process
  const downlodUtil = async (format) => {
    // validate parametrs
    if (!videoInfo) return;
    let videoId = extractVideoId(url);
    if (!videoId) return;
    // initiate the download proces
    setError('');
    setLoading(true);
    try {
      await download({
        title: videoInfo.title,
        videoId: extractVideoId(url),
        format: format,
      });
    } catch (err) {
      console.log(err);
      setError("Failed to download. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to perform the download
  const downloadAudio = async () => await downlodUtil("mp3");
  const downloadVideo = async () => await downlodUtil("mp4");

  return (
    <div className="App">
      <div>
        <div>
          <h1 className="shadows-into-light-regular">Effortlessly Download Your Favorite YouTube Videos and Audio</h1>
          <p>Fast, Simple, and Free - Get the Content You Love in Just a Few Clicks.</p>
        </div>
        <form onSubmit={showVideoInfo}>
          <p className="text-muted">Enter audio/video URL</p>
          <div className="input-group">
            <input type="text" value={url} onChange={e => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=dCmp56tSSmA" />
            <button type="submit" disabled={loading}><i className="fa fa-chevron-right"></i></button>
          </div>
          {error && <p className="error-container">{error}</p>}
          <p className="text-muted text-sm"><strong>Legal</strong>: Please make sure that you have the rights or permissions to extract this file.</p>          
        </form>
        <div className="mt-3">
          {loading && <Loader />}
          {!loading && videoInfo && 
          <div className="preview">
            <h2>{videoInfo.title}</h2>
            <img src={videoInfo.thumbnail} alt={videoInfo.title} />
            <div className="mt-1">
              <button className="btn btn-primary" onClick={downloadAudio}>Extract Audio</button>
              <button className="btn btn-success" onClick={downloadVideo}>Extract Video</button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default App;
