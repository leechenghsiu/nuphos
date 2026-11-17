import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CircleCheck } from 'lucide-react'
import { SidebarNavItem } from '../../src/components/SidebarNavItem'
import { RowFoldToggle } from '../../src/components/sidebar/row-fold-toggle'
import { FinishedThreadsBadge } from '../../src/components/sidebar/nest-guides'
import '../../src/index.css'
function Fixture() {
  const [open, setOpen] = useState(false)
  const [mixedOpen, setMixedOpen] = useState(false)
  const [foldedOpen, setFoldedOpen] = useState(false)
  const [working, setWorking] = useState(false)
  const [theme, setTheme] = useState('light')
  const face = <span className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-2xl">🧑‍🚀</span>
  return <main className="min-h-screen bg-main p-8 text-main"><div className="mx-auto max-w-xl space-y-6">
    <header><h1 className="text-xl font-semibold">Bot list polish</h1><p className="mt-2 text-sm text-secondary">Sample conversations · actual Desktop sidebar components · 36920acc</p></header>
    <div className="flex gap-3"><button id="loading-toggle" onClick={()=>setWorking(!working)}>Toggle working state</button><button id="theme-toggle" onClick={()=>{const next=theme==='light'?'dark':'light';document.documentElement.classList.replace(theme,next);setTheme(next)}}>Switch theme</button></div>
    <section className="w-[340px] rounded-2xl bg-state-selected p-3" aria-label="Sample Bots">
      <div data-sidebar-row id="parent-row"><SidebarNavItem icon={face} label="Release Assistant" active={false} twoLine preview="The sample release checklist is ready for review." time="4:18 PM" note={<FinishedThreadsBadge count={1}/>} edge={<RowFoldToggle item={{key:'sample',label:'Release Assistant',enabled:true}} row={{hasChildren:open,folded:false,running:false,hasDone:true,doneOpen:open}} foldSet={false} toggleFold={()=>{}} toggleDone={()=>setOpen(!open)}/>} onClick={()=>{}}/></div>
      {open&&<div id="sample-child" className="ml-14 flex items-center gap-2 py-2 text-sm text-secondary"><CircleCheck size={14}/>Prepare sample checklist</div>}
      <div data-sidebar-row id="mixed-row"><SidebarNavItem icon={face} label="Mixed running and finished" active={false} twoLine preview="One child is working; one has finished." time="3:55 PM" note={<FinishedThreadsBadge count={1}/>} edge={<RowFoldToggle item={{key:'mixed',label:'Mixed',enabled:true}} row={{hasChildren:true,folded:false,running:true,hasDone:true,doneOpen:mixedOpen}} foldSet={false} toggleFold={()=>setMixedOpen(!mixedOpen)} toggleDone={()=>setMixedOpen(!mixedOpen)}/>} onClick={()=>{}}/></div>
      <div className="ml-14 py-2 text-sm text-secondary">••• Validate sample build</div>{mixedOpen&&<div className="ml-14 py-2 text-sm text-secondary">✓ Prepare sample assets</div>}
      <div data-sidebar-row id="folded-row"><SidebarNavItem icon={face} label="Folded Bot tree" active={false} twoLine preview="The child tree is folded." time="3:50 PM" edge={<RowFoldToggle item={{key:'folded',label:'Folded',enabled:true}} row={{hasChildren:true,folded:!foldedOpen,running:true,hasDone:true,doneOpen:foldedOpen}} foldSet={!foldedOpen} toggleFold={()=>setFoldedOpen(!foldedOpen)} toggleDone={()=>setFoldedOpen(true)}/>} onClick={()=>{}}/></div>
      {foldedOpen&&<div className="ml-14 py-2 text-sm text-secondary">••• Review sample output<br/>✓ Prepare sample data</div>}
      <div data-sidebar-row id="working-row"><SidebarNavItem icon={face} label="Mobile Engineering Assistant with a long descriptive name" active={false} twoLine labelShimmer={working} preview={working?<span className="rounded-full bg-state-selected px-2">•••</span>:'The sample mobile build is ready.'} time="3:42 PM" onClick={()=>{}}/></div>
      <div data-sidebar-row><SidebarNavItem icon={face} label="Design Assistant" active={false} twoLine preview="The updated sample screens are ready." time="Yesterday" onClick={()=>{}}/></div>
    </section><p className="text-sm text-tertiary">Hover to inspect time. Use the edge arrow to expand children.<br/>The done count is informational.</p>
  </div></main>
}
createRoot(document.getElementById('root')!).render(<Fixture/> )
