import {startStack} from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/stack.ts'
import {startDesktop} from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/desktop.ts'
import {stopAll, artifacts} from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/processes.ts'
import {signInScenarios} from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/sign-in-scenarios.ts'
import {botFoldScenarios} from './sidebar-capture-scenarios.ts'
let desktop
try {
 console.log('Artifacts:',artifacts)
 const stack=await startStack()
 desktop=await startDesktop(stack.apiUrl)
 const page=desktop.page
 page.setDefaultTimeout(30000)
 await page.locator('input[type=email]').waitFor()
 await page.evaluate(()=>{localStorage.setItem('nuphos.locale','en');localStorage.setItem('atlas.theme','light')})
 await page.reload()
 await signInScenarios[1].run(page,stack)
 await botFoldScenarios[0].run(page,stack)
 console.log('PASS four-state capture')
} catch(e) {console.error(e);process.exitCode=1} finally {await desktop?.close(true);await stopAll()}
