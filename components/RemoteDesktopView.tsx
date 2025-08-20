import React, { useRef, useEffect, useState } from 'react';
import { DisconnectIcon } from './icons/DisconnectIcon';
import { FullscreenIcon } from './icons/FullscreenIcon';
import { MinimizeIcon } from './icons/MinimizeIcon';

interface RemoteDesktopViewProps {
  connectionId: string;
  onDisconnect: () => void;
}

const RemoteDesktopView: React.FC<RemoteDesktopViewProps> = ({ connectionId, onDisconnect }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startScreenCapture = async () => {
      try {
        // In a real app, you would receive the MediaStream from the WebRTC connection.
        // For this demo, we'll capture the local screen to demonstrate the functionality.
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Screen capture error:", err);
        setError("화면을 표시할 수 없습니다. 화면 공유 권한이 필요합니다.");
      }
    };

    startScreenCapture();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`전체 화면 모드를 활성화하는 중 오류가 발생했습니다: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen bg-black flex flex-col absolute inset-0">
      {/* Remote Desktop Video Feed */}
      <div className="flex-grow w-full h-full relative">
        {error ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-contain"
          >
            사용 중인 브라우저에서는 비디오 태그를 지원하지 않습니다.
          </video>
        )}
        
        {/* You would capture mouse/keyboard events on this div */}
        <div className="absolute inset-0 cursor-crosshair"></div>

        {/* Demo Disclaimer Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4 max-w-sm">
          <h4 className="font-bold text-lg text-cyan-400 mb-2">데모 안내</h4>
          <p className="text-sm text-slate-300">
            실제 원격 데스크톱 연결을 위해서는 시그널링 서버 구현이 필요합니다.
            현재는 기능 시연을 위해 <strong className="font-bold text-white">사용자 본인의 화면</strong>이 표시됩니다.
          </p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-b-lg p-2 flex items-center gap-4 shadow-lg">
         <div className="text-sm text-slate-300">
          연결됨: <span className="font-mono text-cyan-400">{connectionId}</span>
        </div>
        <div className="w-px h-6 bg-slate-600"></div>
        <button 
          onClick={toggleFullscreen}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
          title={isFullscreen ? "전체 화면 종료" : "전체 화면으로 보기"}
        >
          {isFullscreen ? <MinimizeIcon className="w-5 h-5" /> : <FullscreenIcon className="w-5 h-5" />}
        </button>
        <button 
          onClick={onDisconnect}
          className="p-2 flex items-center gap-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
          title="세션 연결 끊기"
        >
          <DisconnectIcon className="w-5 h-5" />
          <span>연결 끊기</span>
        </button>
      </div>
    </div>
  );
};

export default RemoteDesktopView;