/**
 * WebSocket 프록시 서버 (Node.js)
 * HTTPS 환경에서 WSS 연결을 위한 프록시
 */

const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

// SSL 인증서 설정 (자체 서명 또는 Let's Encrypt)
const serverOptions = {
  // key: fs.readFileSync('path/to/private-key.pem'),
  // cert: fs.readFileSync('path/to/certificate.pem')
};

// WSS 서버 생성
const wss = new WebSocket.Server({
  port: 6080, // WSS 포트
  // server: https.createServer(serverOptions) // HTTPS 서버와 함께 사용시
});

console.log('WebSocket 프록시 서버가 포트 6080에서 실행 중입니다.');

wss.on('connection', function connection(ws, req) {
  console.log('클라이언트 연결됨:', req.connection.remoteAddress);
  
  // VNC 서버로의 WebSocket 연결 생성
  const vncWs = new WebSocket('ws://112.214.237.240:5901/websockify');
  
  // 클라이언트 -> VNC 서버
  ws.on('message', function incoming(message) {
    if (vncWs.readyState === WebSocket.OPEN) {
      vncWs.send(message);
    }
  });
  
  // VNC 서버 -> 클라이언트
  vncWs.on('message', function incoming(message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
  
  // 연결 종료 처리
  ws.on('close', function close() {
    console.log('클라이언트 연결 종료');
    vncWs.close();
  });
  
  vncWs.on('close', function close() {
    console.log('VNC 서버 연결 종료');
    ws.close();
  });
  
  // 에러 처리
  ws.on('error', function error(err) {
    console.error('클라이언트 WebSocket 에러:', err);
    vncWs.close();
  });
  
  vncWs.on('error', function error(err) {
    console.error('VNC 서버 WebSocket 에러:', err);
    ws.close();
  });
});
