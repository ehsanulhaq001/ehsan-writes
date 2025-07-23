import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Get git commit hash
const getGitCommitHash = () => {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch (error) {
    console.warn('Could not get git commit hash:', error)
    return 'unknown'
  }
}

// Get short git commit hash
const getGitCommitHashShort = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch (error) {
    console.warn('Could not get git commit hash:', error)
    return 'unknown'
  }
}

export default defineConfig({
  plugins: [react()],
  base: '/ehsan-writes/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Handle client-side routing for SPAs
  server: {
    fs: {
      strict: false
    }
  },
  define: {
    __GIT_COMMIT_HASH__: JSON.stringify(getGitCommitHash()),
    __GIT_COMMIT_HASH_SHORT__: JSON.stringify(getGitCommitHashShort()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
}) 