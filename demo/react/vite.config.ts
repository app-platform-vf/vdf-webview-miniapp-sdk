import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Thay đổi 'dist' thành tên thư mục bạn muốn
    outDir: '../dist/react/dist',
    
    // Nếu bạn muốn dọn dẹp thư mục này trước khi build mới
    emptyOutDir: true, 
  }
})
