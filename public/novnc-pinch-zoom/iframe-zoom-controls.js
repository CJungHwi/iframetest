/**
 * iframe 내 noVNC 줌 제어를 위한 JavaScript
 * 부모 창에서 이 스크립트를 포함하여 사용
 */

class NoVNCIframeController {
    constructor(iframeId) {
        this.iframe = document.getElementById(iframeId);
        this.currentZoomLevel = 100;
        
        // iframe에서 오는 메시지 수신
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'noVNC_zoom_response') {
                this.currentZoomLevel = event.data.zoomLevel;
                this.onZoomLevelChanged(this.currentZoomLevel);
            }
        });
    }
    
    // 줌 인
    zoomIn() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({
                type: 'noVNC_zoom',
                action: 'zoomIn'
            }, '*');
        }
    }
    
    // 줌 아웃
    zoomOut() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({
                type: 'noVNC_zoom',
                action: 'zoomOut'
            }, '*');
        }
    }
    
    // 줌 리셋 (1:1)
    zoomReset() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({
                type: 'noVNC_zoom',
                action: 'zoomReset'
            }, '*');
        }
    }
    
    // 현재 줌 레벨 요청
    getZoomLevel() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({
                type: 'noVNC_zoom',
                action: 'getZoomLevel'
            }, '*');
        }
    }
    
    // 줌 레벨 변경 시 호출되는 콜백 (오버라이드 가능)
    onZoomLevelChanged(zoomLevel) {
        console.log(`noVNC 줌 레벨 변경: ${zoomLevel}%`);
        
        // 줌 레벨 표시 요소가 있다면 업데이트
        const zoomDisplay = document.getElementById('zoom-level-display');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${zoomLevel}%`;
        }
    }
}

// 전역 사용을 위한 함수들
window.NoVNCIframeController = NoVNCIframeController;

// 간편 사용을 위한 헬퍼 함수들
window.createNoVNCController = function(iframeId) {
    return new NoVNCIframeController(iframeId);
};

