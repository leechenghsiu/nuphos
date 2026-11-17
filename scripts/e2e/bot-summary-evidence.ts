// Real Electron + real isolated backend, MongoDB and OpenAB; synthetic agent and data only.
import { rmSync, writeFileSync } from 'node:fs'
import { agentEvents } from './agent-log.ts'
import { startDesktop } from './desktop.ts'
import { artifacts, stopAll, until } from './processes.ts'
import { startStack } from './stack.ts'
import { send } from './ui.ts'
import type { Desktop } from './desktop.ts'

let desktop: Desktop | undefined
let failed = false
try {
  const stack = await startStack()
  desktop = await startDesktop(stack.apiUrl)
  const page = desktop.page
  page.setDefaultTimeout(45_000)
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.emulateMedia({ colorScheme: 'light' })
  await page.evaluate(() => {
    localStorage.setItem('nuphos.locale', 'en')
    localStorage.setItem('atlas.theme', 'light')
  })
  await page.reload()
  await page.locator('input[type=email]').fill(stack.email)
  await page.getByRole('button', { name: 'Continue with email' }).click()
  await page.getByText('Enter the 6-digit code').waitFor()
  await page.locator('input[placeholder="000000"]').fill(stack.signInCode(stack.email) ?? '')
  await page.getByText('Start with your first Bot').waitFor()
  await page.getByRole('button', { name: 'New Bot', exact: true }).click()
  await page.getByRole('textbox', { name: 'Agent name' }).fill('Evidence Bot')
  await page.getByRole('button', { name: 'Create', exact: true }).click()
  await page.getByText('POSTED E2E_DELIVERY:missing', { exact: true }).waitFor()
  await until('Bot introduction finishes', async () => agentEvents(stack).includes('finish E2E_DELIVERY:missing'))
  const headers = { authorization: `Bearer ${stack.token}`, 'content-type': 'application/json' }
  const response = await fetch(`${stack.apiUrl}/agent/conversations?teamId=${stack.teamId}`, { headers })
  if (!response.ok) throw new Error(`Conversation list failed: ${response.status}`)
  const listed = await response.json() as { conversations: { sessionId: string; title: string; kind?: string }[] }
  const bot = listed.conversations.find(row => row.title === 'Evidence Bot' && row.kind !== 'channel')
  if (!bot) throw new Error('Created Bot was not listed')
  const created = await fetch(`${stack.apiUrl}/agent/triggers`, {
    method: 'POST', headers,
    body: JSON.stringify({ teamId: stack.teamId, targetSessionId: bot.sessionId,
      name: 'Weekly design sync (fixture)', triggerType: 'cron', cronExpression: '0 1 * * 1',
      messageTemplate: 'Synthetic evidence fixture; do not use any external service.' }),
  })
  if (!created.ok) throw new Error(`Trigger creation failed: ${created.status} ${await created.text()}`)
  await page.getByRole('button', { name: 'Triggers', exact: true }).click()
  await page.getByText('Weekly design sync (fixture)', { exact: true }).waitFor()
  const scoped = await fetch(`${stack.apiUrl}/agent/triggers?teamId=${stack.teamId}&targetSessionId=${bot.sessionId}`, { headers })
  const rows = await scoped.json() as { targetSessionId: string; name: string }[]
  if (rows.length !== 1 || rows.some(row => row.targetSessionId !== bot.sessionId)) throw new Error('Trigger list is not Bot-scoped')
  await page.screenshot({ path: `${artifacts}/01-bot-triggers.png` })
  await page.keyboard.press('Escape')
  await page.getByRole('dialog', { name: 'Triggers', exact: true }).waitFor({ state: 'hidden' })
  await send(page, 'Ask me E2E_ASK_CREDENTIAL E2E_DELIVERY:evidence')
  await page.getByRole('button', { name: 'E2E_DELIVERY:answered', exact: true }).first().waitFor()
  await page.getByRole('button', { name: 'Task', exact: true }).click()
  await page.getByRole('button', { name: 'Toggle task summary', exact: true }).click()
  const summary = page.getByRole('complementary', { name: 'Agent summary', exact: true })
  await summary.getByText('Which marker should the fixture use?', { exact: true }).first().waitFor()
  await summary.getByText('Weekly design sync (fixture)', { exact: true }).waitFor()
  await page.screenshot({ path: `${artifacts}/02-task-summary-question.png` })
  await page.getByRole('button', { name: 'Back to conversation', exact: true }).click()
  await page.getByRole('button', { name: 'Back to conversation', exact: true }).waitFor({ state: 'hidden' })
  await page.getByRole('button', { name: 'Triggers', exact: true }).waitFor()
  if (await page.getByRole('dialog', { name: 'Triggers', exact: true }).count()) throw new Error('Underlying chat popover changed from closed to open')
  await page.screenshot({ path: `${artifacts}/03-chat-restored.png` })
  writeFileSync(`${artifacts}/evidence-result.json`, JSON.stringify({ sourceHead: '6de7bfc4dba170dd3fd12d8a4b8e54e7801536ac',
    realElectron: true, realBackend: true, syntheticData: true, theme: 'light', botScopedRows: rows.length,
    pendingQuestionInSummary: true, chatPopoverBefore: 'closed', chatPopoverAfter: 'closed' }, null, 2))
  console.log('PASS real Electron Bot trigger and Task summary evidence')
} catch (error) {
  failed = true
  console.error(error)
} finally {
  await desktop?.close()
  await stopAll()
  if (desktop) rmSync(desktop.profile, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
