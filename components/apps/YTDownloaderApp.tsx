
import React, { useState, useEffect } from 'react';

type DownloadFormat = 'mp4' | 'mp3';
type DownloadStatus = 'idle' | 'downloading' | 'converting' | 'success' | 'error';

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const YTDownloaderApp: React.FC = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<DownloadFormat>('mp4');
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval: number;

    const runProgress = (duration: number, onComplete: () => void) => {
      setProgress(0);
      let startTime = Date.now();
      interval = window.setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.min(Math.round((elapsedTime / duration) * 100), 100);
        setProgress(newProgress);
        if (newProgress >= 100) {
          clearInterval(interval);
          onComplete();
        }
      }, 50);
    };

    if (status === 'downloading') {
      runProgress(3000, () => {
        if (format === 'mp3') {
          setStatus('converting');
        } else {
          setStatus('success');
        }
      });
    } else if (status === 'converting') {
      runProgress(2000, () => {
        setStatus('success');
      });
    }

    return () => clearInterval(interval);
  }, [status, format]);

  const handleDownload = () => {
    if (!url.includes('youtube.com/') && !url.includes('youtu.be/')) {
        setErrorMessage('Please enter a valid YouTube URL.');
        setStatus('error');
        return;
    }
    setErrorMessage('');
    setStatus('downloading');
  };
  
  const handleReset = () => {
      setUrl('');
      setStatus('idle');
      setProgress(0);
      setErrorMessage('');
  }

  const isProcessing = status === 'downloading' || status === 'converting';

  return (
    <div className="flex flex-col h-full p-4 space-y-6 bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">WinTube Video & MP3 Downloader</h1>
        <p className="text-gray-500">Paste a YouTube link below to start.</p>
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="url-input" className="font-semibold text-gray-700">YouTube URL</label>
        <input
          id="url-input"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isProcessing}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <span className="font-semibold text-gray-700">Format</span>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="format" value="mp4" checked={format === 'mp4'} onChange={() => setFormat('mp4')} className="form-radio h-5 w-5 text-blue-600" disabled={isProcessing} />
            <span className="text-gray-800">Video (MP4)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="format" value="mp3" checked={format === 'mp3'} onChange={() => setFormat('mp3')} className="form-radio h-5 w-5 text-blue-600" disabled={isProcessing} />
            <span className="text-gray-800">Audio (MP3)</span>
          </label>
        </div>
      </div>

      <div className="pt-4">
        {status === 'idle' && (
             <button onClick={handleDownload} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <DownloadIcon />
                <span>Start Download</span>
            </button>
        )}
        
        {isProcessing && (
            <div className="w-full">
                <p className="text-center font-semibold text-blue-700 mb-2 capitalize">{status}...</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full transition-all duration-150" style={{width: `${progress}%`}}></div>
                </div>
            </div>
        )}
        
        {status === 'success' && (
             <div className="text-center p-4 bg-green-100 border border-green-400 text-green-800 rounded-lg">
                <CheckCircleIcon className="w-12 h-12 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Download Complete!</h3>
                <p className="text-sm">Your file has been saved to your Downloads folder.</p>
                <button onClick={handleReset} className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Download Another
                </button>
            </div>
        )}

        {status === 'error' && (
            <div className="text-center p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
                <XCircleIcon className="w-12 h-12 mx-auto mb-2" />
                <h3 className="font-bold text-lg">Error</h3>
                <p className="text-sm">{errorMessage}</p>
                 <button onClick={handleReset} className="mt-4 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Try Again
                </button>
            </div>
        )}

      </div>
    </div>
  );
};
