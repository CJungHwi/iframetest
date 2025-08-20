/**
 * Vercel 서버리스 함수를 통한 WebSocket 프록시
 * 하지만 Vercel은 WebSocket을 직접 지원하지 않으므로
 * 대신 HTTP 기반 폴링 방식을 사용해야 합니다.
 */

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // WebSocket 연결 정보 반환
  res.status(200).json({
    message: 'WebSocket 프록시는 Vercel에서 직접 지원되지 않습니다.',
    alternatives: [
      '1. 별도의 WebSocket 프록시 서버 구축',
      '2. VNC 서버에서 WSS 지원 활성화',
      '3. 로컬 개발 환경에서 테스트'
    ],
    vncServer: {
      host: '112.214.237.240',
      port: 5901,
      protocol: 'ws://', // HTTP에서만 작동
      httpsNote: 'HTTPS 환경에서는 wss:// 프로토콜이 필요합니다.'
    }
  });
}
