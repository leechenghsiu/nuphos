import React from 'react'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import { NewChatButton } from '../src/components/sidebar/NewChatButton'
import { ChannelEmptyState } from '../src/components/channels/ChannelEmptyState'
import { Typing } from '../src/components/channels/ChannelTyping'
const state=new URLSearchParams(location.search).get('state')??'form-default'
const preparing=state==='empty-preparing'
const empty=state.startsWith('empty-')
const bot={sessionId:'review-bot',title:'Project Coordinator',avatar:'07-ada',agentRuntime:'codex'}
createRoot(document.getElementById('root')!).render(<div className="h-screen bg-surface text-main"><div className="border-b border-main px-8 py-5 text-sm font-medium">Project Coordinator</div><main className="mx-auto max-w-[760px] px-3 pt-8">{empty?<><ChannelEmptyState title="Project Coordinator" faces={[{id:'review-bot',name:'Project Coordinator',agent:{avatar:'07-ada'}}]} bot preparingFirstReply={preparing} firstReplyFailed={!preparing}/>{preparing&&<div className="pt-6"><Typing agents={[bot] as any} channelId="review-chat" initialBotId="review-bot"/></div>}</>:<div className="flex items-center gap-4 text-sm">Bots<NewChatButton teamId="review-team" onCreated={()=>{}}/></div>}</main><div className="fixed bottom-3 right-4 text-[11px] text-tertiary">UI review fixture · 63cace67 · {state}</div></div>)
