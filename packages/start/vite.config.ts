import { defineConfig } from "vite"
import path from "path"

const thisFolder = path.resolve(__dirname)
const publicFolder = path.join(thisFolder, "public")
const packagesPath = path.join(thisFolder, "../../packages")


// Configure libraries you want to load from CDN/import map so they are not bundled.
// Add more keys to externals as needed.
const externals = [
  'oidc-client-ts'
]

export default defineConfig({
  server: {
    port: 8000,
    strictPort: true
  },
  publicDir: publicFolder,
  resolve: {
    alias: {
      // Keep in sync with tsconfig.base.json paths
      "@dash/grid": path.join(packagesPath, "grid", "src"),
      "@dash/design": path.join(packagesPath, "design", "src"),
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: externals,
    },
    target: 'esnext'
  },
  optimizeDeps: {
    // Exclude externals from pre-bundling in dev as well
    exclude: externals
  }
})
