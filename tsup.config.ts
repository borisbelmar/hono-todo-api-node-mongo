import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  minify: false,
  splitting: false,
  treeshake: true,
  external: [
    'mongoose',
    'dotenv',
    '@hono/node-server',
    '@hono/swagger-ui',
    '@hono/zod-openapi',
    'hono',
    'jose',
    'nanoid',
    'scrypt-js',
    'zod',
  ],
})
