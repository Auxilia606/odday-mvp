import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages는 https://{username}.github.io/{repo}/ 하위 경로로 서빙되므로
// base를 레포 이름('/odday-mvp/')과 일치시킨다. 값이 다르면 배포는 되지만
// CSS·JS 자산이 404로 깨진다. (MVP 문서 섹션 6)
export default defineConfig({
  base: "/odday-mvp/",
  plugins: [react()],
});
