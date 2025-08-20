import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface ConnectScreenProps {
  onConnect: (id: string) => void;
  onCancel: () => void;
  error: string | null;
  isLoading: boolean;
}

const ConnectScreen: React.FC<ConnectScreenProps> = ({ onConnect, onCancel, error, isLoading }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onConnect(id.replace(/\s/g, ''));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '').toUpperCase();
    const formattedValue = rawValue.match(/.{1,3}/g)?.join(' ') || '';
    setId(formattedValue);
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 max-w-md mx-auto flex flex-col items-center text-center shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-2">원격 PC에 연결</h2>
      <p className="text-slate-400 mb-8">
        원격 컴퓨터의 연결 코드를 입력하세요.
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <input
            type="text"
            value={id}
            onChange={handleInputChange}
            placeholder="예: ABC 123 XYZ"
            maxLength={11} // 9 chars + 2 spaces
            className="w-full p-4 text-center bg-slate-900 border-2 border-slate-600 rounded-md text-2xl font-mono tracking-widest text-white focus:border-cyan-400 focus:ring-cyan-400 focus:outline-none transition-colors"
            aria-label="연결 코드 입력"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isLoading}
            className="w-full bg-slate-600 text-white font-bold py-3 px-6 rounded-md hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50"
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={isLoading || !id}
            className="w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Spinner /> 연결 중...
              </>
            ) : (
              '연결'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConnectScreen;
