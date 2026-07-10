import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages는 https://{username}.github.io/odday/ 하위 경로로 서빙되므로
// base를 '/odday/'로 설정한다. (MVP 문서 섹션 6)
export default defineConfig({
  base: "/odday/",
  plugins: [react()],
});
