import React from 'react';
import { ComputerIcon } from './icons/ComputerIcon';
import { ShareIcon } from './icons/ShareIcon';
import { Logo } from './icons/Logo';

interface IdleScreenProps {
  onShare: () => void;
  onConnect: () => void;
}

const IdleScreen: React.FC<IdleScreenProps> = ({ onShare, onConnect }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center items-center gap-4 mb-8">
        <Logo className="w-16 h-16 text-cyan-400" />
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          WebRTC 원격 데스크톱
        </h1>
      </div>
      <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
        브라우저에서 직접 Windows PC에 안전하게 접속하거나 화면을 공유하세요. 별도의 설치가 필요 없습니다.
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChoiceCard
          icon={<ShareIcon />}
          title="이 화면 공유하기"
          description="다른 사용자가 이 Windows PC를 보고 제어할 수 있도록 허용합니다."
          onClick={onShare}
          buttonText="코드 생성"
        />
        <ChoiceCard
          icon={<ComputerIcon />}
          title="원격 PC에 연결"
          description="연결 코드를 입력하여 다른 컴퓨터에 접속합니다."
          onClick={onConnect}
          buttonText="코드 입력"
        />
      </div>
    </div>
  );
};

interface ChoiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  buttonText: string;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ icon, title, description, onClick, buttonText }) => (
  <div
    className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 flex flex-col items-center justify-between hover:bg-slate-800 hover:border-cyan-400 transition-all duration-300 cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold mt-4 text-white">{title}</h2>
      <p className="text-slate-400 mt-2 text-center">{description}</p>
    </div>
    <button className="mt-8 w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-md hover:bg-cyan-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75">
      {buttonText}
    </button>
  </div>
);

export default IdleScreen;
