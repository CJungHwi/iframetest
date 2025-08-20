import React, { useState, useEffect, useRef } from 'react';
import { generateId } from '../utils/idGenerator';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { Spinner } from './Spinner';

interface SharingScreenProps {
  onCancel: () => void;
}

const SharingScreen: React.FC<SharingScreenProps> = ({ onCancel }) => {
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionId(generateId(9));
    }, 1500);

    let stream: MediaStream | null = null;

    const startScreenShare = async () => {
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        console.error("화면 공유 오류:", err);
        setError("화면 공유 권한이 거부되었습니다. 기능을 사용하려면 권한을 허용해 주세요.");
        // Stop sharing if permission is denied
        // onCancel(); 
      }
    };

    startScreenShare();

    return () => {
      clearTimeout(timer);
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCopy = () => {
    if (connectionId) {
      navigator.clipboard.writeText(connectionId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 max-w-2xl mx-auto flex flex-col items-center text-center shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-4">화면을 공유하고 있습니다</h2>
      <p className="text-slate-400 mb-8">
        연결하려는 상대방에게 아래 코드를 전달하세요.
      </p>

      <div className="w-full p-6 bg-slate-900 rounded-lg border border-slate-600 mb-6">
        <p className="text-sm text-slate-400 mb-2 uppercase tracking-wider">내 연결 코드</p>
        {connectionId ? (
          <div className="relative flex items-center justify-center">
            <span className="text-5xl font-mono tracking-widest text-cyan-400 select-all">
              {connectionId.match(/.{1,3}/g)?.join(' ')}
            </span>
            <button
              onClick={handleCopy}
              className="absolute right-0 p-2 text-slate-400 hover:text-white transition-colors duration-200"
              aria-label="연결 코드 복사"
            >
              {isCopied ? <CheckIcon className="w-6 h-6 text-green-400" /> : <ClipboardIcon className="w-6 h-6" />}
            </button>
          </div>
        ) : (
          <div className="h-[60px] flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>

      <div className="w-full mb-6">
        <p className="text-sm text-slate-400 mb-2 uppercase tracking-wider">화면 미리보기</p>
        <div className="aspect-video bg-black rounded-lg border border-slate-600 overflow-hidden">
          {error ? (
             <div className="w-full h-full flex items-center justify-center p-4">
               <p className="text-red-400">{error}</p>
             </div>
          ) : (
            <video ref={videoRef} autoPlay muted className="w-full h-full object-contain"></video>
          )}
        </div>
      </div>

      <div className="w-full flex items-center bg-blue-900/20 text-blue-200 border border-blue-500/30 rounded-lg p-4 mb-8">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
        </div>
        <div>
          <h3 className="font-semibold">연결을 기다리는 중...</h3>
          <p className="text-sm">이 창을 열어두세요. 상대방이 연결하면 세션이 자동으로 시작됩니다.</p>
        </div>
      </div>
      
      <button 
        onClick={onCancel}
        className="bg-slate-600 text-white font-bold py-2 px-6 rounded-md hover:bg-slate-700 transition-colors duration-300"
      >
        공유 중단
      </button>
    </div>
  );
};

export default SharingScreen;