import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Thay đổi 'dist' thành tên thư mục bạn muốn
    outDir: '../dist/vue/dist',
    
    // Nếu bạn muốn dọn dẹp thư mục này trước khi build mới
    emptyOutDir: true, 
  }
})
