import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import path from 'node:path';
export default defineConfig({root:import.meta.dirname,plugins:[react()],server:{fs:{allow:[path.resolve(import.meta.dirname,'../..')]}}})
