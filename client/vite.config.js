import { defineConfig } from 'vite'
import fs from "fs"
import react from '@vitejs/plugin-react'

const httpsConfig = {
  cert: fs.readFileSync("../certs/server.crt"),
  key: fs.readFileSync("../certs/key.pem"),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4443,
    https: httpsConfig,
  }
})
