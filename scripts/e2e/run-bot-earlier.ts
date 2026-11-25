// `bun scripts/e2e/run-bot-earlier.ts`: a Bot that talked before its chat existed (#5061).
// A Task with a conversation is made a Bot, so its chat is made after those messages, as an
// older Bot's is. The empty chat should lead back to them. E2E_EXPECT_LINK=0 records main.
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

import { startDesktop } from './desktop.ts'
import { artifacts, stopAll } from './processes.ts'
import { signInScenarios } from './sign-in-scenarios.ts'
import { startStack } from './stack.ts'
import { newTask, pickAgent, send, transcriptPost } from './ui.ts'

import type { Desktop } from './desktop.ts'

let desktop: Desktop | undefined
let failed = false
const expectLink = process.env.E2E_EXPECT_LINK !== '0'

try {
  console.log(`Artifacts: ${artifacts}`)
  const stack = await startStack()

  desktop = await startDesktop(stack.apiUrl)
  const { page } = desktop

  page.setDefaultTimeout(30_000)
  for (const scenario of signInScenarios) await scenario.run(page, stack)
  await newTask(page)
  await pickAgent(page, 'E2E fixture agent')
  await send(page, 'Say hello E2E_DELIVERY:earlier')
  await page.getByText('ACK E2E_DELIVERY:earlier').waitFor()
  await page.getByRole('button', { name: 'More actions', exact: true }).first().click()
  await page.getByRole('menuitem', { name: 'Make this a Bot' }).click()
  const intro = page.getByText(/^This is where you and .+ get things done/)

  await intro.waitFor()
  // A Bot from before Bot chats had none: its chat goes, as if it was never made, once the
  // Bot has named itself. Opening the Bot then makes the chat, after all its messages.
  await page.waitForTimeout(8000)
  const bot = JSON.parse(
    execFileSync(
      'bun',
      [
        '-e',
        `import { MongoClient } from 'mongodb'
        const client = await new MongoClient(process.argv[1]).connect()
        const all = client.db('nuphos_e2e').collection('agent_conversations')
        const bot = await all.findOne({ avatar: { $exists: true }, kind: { $ne: 'channel' } })
        const gone = await all.deleteMany({ kind: 'channel', agentSessionIds: bot.sessionId })
        console.log(JSON.stringify({ title: bot.title, lastActiveAt: bot.lastActiveAt, removed: gone.deletedCount }))
        await client.close()`,
        stack.mongoUri,
      ],
      { cwd: resolve(import.meta.dirname, '../../apps/backend'), timeout: 10_000 },
    ).toString(),
  ) as { title: string; lastActiveAt: string; removed: number }

  console.log('Legacy Bot staged:', JSON.stringify(bot))
  await page.reload()
  await page.getByRole('tab', { name: 'Bots' }).click()
  await page.getByText(bot.title, { exact: true }).first().click()
  await intro.waitFor()
  await page.evaluate(() => document.documentElement.classList.replace('dark', 'light'))
  const link = page.getByRole('button', { name: /^See earlier messages with / })

  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${artifacts}/bot-earlier-chat.png` })
  if (!expectLink) {
    if (await link.isVisible()) throw new Error('main already shows the link')
    console.log('PASS (main): the Bot chat is empty and nothing leads to the earlier messages')
  } else {
    await link.click()
    await transcriptPost(page, 'Say hello E2E_DELIVERY:earlier').waitFor()
    await page.getByText('ACK E2E_DELIVERY:earlier').waitFor()
    await page.waitForTimeout(800)
    await page.screenshot({ path: `${artifacts}/bot-earlier-opened.png` })
    console.log('PASS (head): the link opens the messages from before the chat')
  }
} catch (error) {
  failed = true
  console.error(error)
  if (desktop) await desktop.page.screenshot({ path: `${artifacts}/failed.png` }).catch(() => {})
} finally {
  await desktop?.close(failed)
  await stopAll()
}
process.exit(failed ? 1 : 0)
