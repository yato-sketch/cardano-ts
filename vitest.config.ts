import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/tests/**/*.ts'],
    environment: 'node',
    setupFiles: ['dotenv/config'],
  },
}) 