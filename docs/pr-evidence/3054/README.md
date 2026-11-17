# Real Desktop evidence for PR #3054

Product head: `6de7bfc4dba170dd3fd12d8a4b8e54e7801536ac`.
The evidence branch adds a workflow and an end-to-end capture script only; it does not alter product code.

Environment: real Electron main process and renderer, real backend and MongoDB, and real OpenAB with the repository's deterministic ACP fixture agent. The account, team, Bot, trigger and question are synthetic. No production API, provider, account or credential is used. Appearance is light throughout.

The flow creates a Bot through the app, creates one fixture cron bound to that Bot, opens the header Triggers control, and verifies the real scoped API returns one row for the Bot. It then asks a fixture question in the Bot chat, enters Task, opens the summary and verifies the pending question and trigger. After leaving the Task overlay, the underlying Bot chat's trigger popover remains closed, as it was before entering Task.

Run: https://github.com/leechenghsiu/nuphos/actions/runs/44027811361
Capture source: https://github.com/leechenghsiu/nuphos/blob/da1b7ea0adac49011a75d5a50f378fc55ca086c1/scripts/e2e/bot-summary-evidence.ts
