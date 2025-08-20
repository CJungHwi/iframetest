import React, { useState, useCallback } from 'react';
import { AppState } from './types';
import IdleScreen from './components/IdleScreen';
import SharingScreen from './components/SharingScreen';
import ConnectScreen from './components/ConnectScreen';
import RemoteDesktopView from './components/RemoteDesktopView';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [connectionId, setConnectionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStartSharing = useCallback(() => {
    setAppState(AppState.SHARING);
    setError(null);
  }, []);

  const handleStartConnecting = useCallback(() => {
    setAppState(AppState.CONNECTING);
    setError(null);
  }, []);

  const handleConnect = useCallback((id: string) => {
    setConnectionId(id);
    setAppState(AppState.CONNECTING_IN_PROGRESS);
    
    // Simulate connection delay
    setTimeout(() => {
      // Simulate a successful connection for demonstration
      if (id.trim().length > 0) {
        setAppState(AppState.CONNECTED);
      } else {
        setError("잘못된 연결 ID입니다. 다시 시도해 주세요.");
        setAppState(AppState.CONNECTING);
      }
    }, 2000);

  }, []);

  const handleDisconnect = useCallback(() => {
    setAppState(AppState.IDLE);
    setConnectionId('');
    setError(null);
  }, []);
  
  const handleCancel = useCallback(() => {
    setAppState(AppState.IDLE);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.IDLE:
        return <IdleScreen onShare={handleStartSharing} onConnect={handleStartConnecting} />;
      case AppState.SHARING:
        return <SharingScreen onCancel={handleCancel} />;
      case AppState.CONNECTING:
        return <ConnectScreen onConnect={handleConnect} onCancel={handleCancel} error={error} isLoading={false} />;
      case AppState.CONNECTING_IN_PROGRESS:
        return <ConnectScreen onConnect={handleConnect} onCancel={handleCancel} error={error} isLoading={true} />;
      case AppState.CONNECTED:
        return <RemoteDesktopView connectionId={connectionId} onDisconnect={handleDisconnect} />;
      default:
        return <IdleScreen onShare={handleStartSharing} onConnect={handleStartConnecting} />;
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
