import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // 정적 파일들을 public 디렉토리에서 서빙
      publicDir: 'public',
      build: {
        outDir: 'dist',
        // 정적 파일 복사 설정
        copyPublicDir: true,
        rollupOptions: {
          // 외부 의존성으로 처리하여 번들링하지 않음
          external: [
            /^\/novnc-pinch-zoom\/.*/
          ]
        }
      },
      // 개발 서버에서 정적 파일 서빙
      server: {
        fs: {
          allow: ['..', '.']
        }
      }
    };
});
