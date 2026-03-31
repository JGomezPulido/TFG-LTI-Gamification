import { defineConfig } from 'vite'
import fs from "fs"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const httpsConfig = {
  cert: fs.readFileSync("../certs/server.crt", 'utf8'),
  key: fs.readFileSync("../certs/key.pem", 'utf8'),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 4443,
    https: httpsConfig,
    origin: 'https://localhost:4443',
  },
  envDir: '.',
  base: 'https://localhost:4443',
});
