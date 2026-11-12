import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
const dir=path.resolve('.review-fixture')
export default defineConfig({root:dir,publicDir:path.resolve('public'),plugins:[{name:'review-dependencies',enforce:'pre',resolveId(id){if(/(^|\/)api(\.ts)?$/.test(id))return path.join(dir,'api.ts');if(id.endsWith('/useNewConversationRuntime'))return path.join(dir,'runtime.ts');if(id.endsWith('/agentRuntimeStates'))return path.join(dir,'states.ts');if(id.endsWith('/BotImportDialog')||id.endsWith('/LocalAgentsStep'))return path.join(dir,'unused.tsx')}},react()],server:{fs:{allow:[path.resolve('.')]}}})
