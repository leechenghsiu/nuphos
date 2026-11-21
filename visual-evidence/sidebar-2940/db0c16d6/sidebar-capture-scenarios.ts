// Scenarios about the sidebar itself.
import { agentEvents } from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/agent-log.ts'
import { client, must } from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/binding-access-scenarios.ts'
import { checkDockToggleClear } from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/chat-presentation.ts'
import { artifacts, until } from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/processes.ts'
import { newTask, send } from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/ui.ts'

import type { Scenario } from '/Users/leechenghsiu/Desktop/Zeabur/Internal/nuphos-sidebar-expand/scripts/e2e/ui.ts'

export const sidebarScenarios: Scenario[] = [
  {
    // The pages' viewport was `overflow: hidden`, which focus still scrolls: every page showed cut off.
    name: 'every sidebar page shows from its left edge, never scrolled sideways',
    run: async (page) => {
      await newTask(page)
      await send(page, 'Hello E2E_DELIVERY:sidebar')
      await page.getByText('ACK E2E_DELIVERY:sidebar').waitFor()
      await checkDockToggleClear(page, 'Task chat header')
      // Open, the dock's tab strip is what runs under the toggle.
      await page.getByRole('button', { name: 'Open workspace panel' }).click()
      await page.getByRole('button', { name: 'Close workspace panel' }).waitFor()
      await page.waitForTimeout(500)
      await checkDockToggleClear(page, 'dock tab strip', '[class*="--dock-toggle-pad"]')
      await page.getByRole('button', { name: 'Close workspace panel' }).click()
      for (const tab of ['Tasks', 'Inbox', 'Bots']) {
        await page.getByRole('tab', { name: tab }).click()
        await page.waitForTimeout(500)
        await page.screenshot({ path: `${artifacts}/sidebar-${tab.toLowerCase()}.png` })
        const sideways = await page.evaluate(
          () => document.querySelector('.sidebar-swipe-viewport')?.scrollLeft,
        )

        must(sideways === 0, `the ${tab} page not to be scrolled sideways, got ${String(sideways)}`)
      }
    },
  },
]

export const botFoldScenarios: Scenario[] = [
  {
    // #2898: a Bot's tree opened by hand folded again whenever Bots was left.
    name: 'a Bot tree opened by hand stays open after Tasks and back, and after a reload',
    run: async (page, stack) => {
      const api = client(stack.apiUrl, stack.token)
      const count = (event: string) =>
        agentEvents(stack).filter((logged) => logged === event).length
      const introductions = count('finish E2E_DELIVERY:missing')
      const asked = count('permission-asked E2E_DELIVERY:thread')
      // Its own Bot, so no scenario before it decides what the tree holds.
      const row = page.locator('[data-sidebar-row]').filter({ hasText: 'Release coordination assistant with a deliberately long title for truncation review' }).first()
      const show = row.locator('[aria-label="Show sub-agents"]')
      const hide = row.locator('[aria-label="Hide sub-agents"]')
      const mustBeOpen = async (when: string) => {
        await until(
          `the Bot tree to show ${when}`,
          async () => (await show.count()) + (await hide.count()) === 1,
        )
        must((await hide.count()) === 1, `the opened Bot tree to stay open ${when}`)
      }

      await page.getByRole('tab', { name: 'Bots' }).click()
      // Bots already exist here, so New Bot sits in the + menu.
      await page.getByRole('button', { name: 'New Bot', exact: true }).click()
      await page.getByRole('textbox', { name: 'Bot name' }).fill('Release coordination assistant with a deliberately long title for truncation review')
      await page.getByRole('button', { name: 'Create', exact: true }).click()
      await until(
        'the new Bot to introduce itself',
        async () => count('finish E2E_DELIVERY:missing') > introductions,
      )
      const bots = await api('GET', `/agent/conversations?teamId=${stack.teamId}&bots=true`)
      const bot = (bots.body as { conversations: { sessionId: string }[] }).conversations[0]!
      // Out of Full Access, its sub-agent waits for a person to allow its command and so stays
      // in the tree: a finished one sits behind the done badge, remembered before #2898 too.
      const mode = await api('PUT', '/agent/auto-mode/bypass', {
        sessionId: bot.sessionId,
        bypass: false,
      })

      must(mode.status === 200, `the Bot to leave Full Access, got ${String(mode.status)}`)
      await send(page, 'Start a thread E2E_THREAD E2E_DELIVERY:fold')
      await until(
        'the sub-agent to wait on its command',
        async () => count('permission-asked E2E_DELIVERY:thread') > asked,
      )
      // Folded until someone opens it.
      await show.click()
      await mustBeOpen('once opened')
      await page.getByRole('tab', { name: 'Tasks' }).click()
      await page.getByRole('button', { name: 'New task', exact: true }).waitFor()
      await page.getByRole('tab', { name: 'Bots' }).click()
      await mustBeOpen('after Tasks and back')
      await page.reload()
      await page.getByRole('tab', { name: 'Bots' }).click()
      await mustBeOpen('after a reload')
      await page.screenshot({ path: `${artifacts}/bot-tree-open-after-reload.png` })
      const box = await row.boundingBox()
      if (!box) throw new Error('No row bounds')
      const clip = {x: 0, y: box.y - 8, width: 270, height: box.height + 65}
      await page.mouse.move(700, 400)
      await page.getByRole('textbox', {name: 'Message'}).click()
      await page.screenshot({path: `${artifacts}/01-rest.png`, clip})
      await row.hover()
      await page.screenshot({path: `${artifacts}/02-hover.png`, clip})
      await page.mouse.move(700,400)
      await page.getByRole('textbox', {name:'Message'}).click()
      for(let i=0;i<100;i++) {
        await page.keyboard.press('Tab')
        if(await row.evaluate(el=>el.contains(document.activeElement))) break
      }
      if(!await row.evaluate(el=>el.contains(document.activeElement))) throw new Error('Tab did not reach row')
      await page.screenshot({path: `${artifacts}/03-keyboard.png`,clip})
      await row.hover()
      await hide.click()
      await page.mouse.move(700,400)
      await page.getByRole('textbox', {name:'Message'}).click()
      await page.screenshot({path: `${artifacts}/04-folded.png`,clip})
      // Back in the Bot chat, where the scenarios after this one found the window before.
      await row.click()
    },
  },
]
