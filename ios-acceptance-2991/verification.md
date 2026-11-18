Fixture-backed sign-ins could read the saved real-account registry and then hide newly added fixture accounts, while custom-drawn chat text was visible but absent from the accessibility tree. This made the account and second-conversation acceptance checks fail on iPad.

This change keeps preview saved accounts in memory and avoids deleting real legacy credentials from preview cleanup. It exposes the rendered plain/Markdown string on the custom text label. The UI checks now verify the second Task's own message, use split-view navigation on iPad, select the visible workspace button, dismiss the keyboard before tab selection, and compare the Inbox answer controls against the actual question frame.

Refs #2991. This completes a bounded acceptance follow-up; it does not close that tracker or add search, task-tree discovery, payments or runtime provisioning.

## How this was verified

- Ported cleanly onto main `43f54aeaeca7500129ad3bae065997aa1e49dbb6`.
- iPad Pro 13-inch (M5), iPadOS 26.4: **9/9 passed**. Account/profile, danger zone, no runtime, no workspace, Bot/Task reopening, native tabs, Inbox geometry and adding-account return/sign-out.
- iPhone 17 Pro, iOS 26.4: **2/2 passed**. Bot and Task reopening.
- Existing `apps/ios/tests/run.sh`: passed (exit 0); `git diff --check`: passed.
- The stronger second-Task message assertion failed in the previous acceptance pass and now finds `Hello from push-b`. The original failure and the local uncommitted precursor runs are recorded in #2991; these fresh selected results use the latest-main port.

The app runs on iPhone/iPad simulators using synthetic offline fixture accounts and conversations. No live OAuth, real Inbox reply, purchase or account deletion was performed. The checks verify accessibility exposure through XCTest; physical VoiceOver reading, custom text links and the full app accessibility experience have not been manually certified. The full PR UI-suite comparison will be reported from CI rather than inferred from the selected local cases.

Visual evidence: [iPad second Task and its own message](ipad-second-task.png). The screenshot uses the same fixture and patched app, launched with the fixture deep links; the automated cases separately exercise list selection.
