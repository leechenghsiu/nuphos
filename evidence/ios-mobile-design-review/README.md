# Review follow-up evidence

Source: `7cd12fe7f6199272b7559246f7907f0a00f786bd` for PR #3343. All data is synthetic and isolated from production.

The new manual iPad recording uses the final built application: open a Bot chat, open its Task, inspect the native options menu (no Share), open and cancel Bot archive confirmation, then select another Bot. The previous Task is popped, and workspace actions remain directly reachable in the sidebar. No archive request is sent.

The iPhone login capture shows the final native Apple control and the Google control at the matching height. Other screenshots are XCTest captures of unchanged navigation/account surfaces from this follow-up implementation.

Validation: complete `apps/ios/tests/run.sh` passes, including both string catalogs; iPhone targeted suite 7/7 passes; iPad targeted account and summary tests pass and the expanded Bot navigation regression passes; the final login-only iPhone rerun passes. These are author-run simulator checks, not an independent review or App Review approval. Dark mode and production OAuth were not exercised here.

The video is silent, scaled to 720 pixels wide, and played at 1.5x.

- [ipad-bot-own-task.png](ipad-bot-own-task.png)
- [ipad-bot-task-options.png](ipad-bot-task-options.png)
- [ipad-bot-task-returned-to-chat.png](ipad-bot-task-returned-to-chat.png)
- [ipad-bot-task-selection-reset.png](ipad-bot-task-selection-reset.png)
- [phone-account-overview.png](phone-account-overview.png)
- [phone-account-profile-edit.png](phone-account-profile-edit.png)
- [phone-agent-summary-top.png](phone-agent-summary-top.png)
- [phone-bot-pin-preview.png](phone-bot-pin-preview.png)
- [phone-bot-task-options.png](phone-bot-task-options.png)
- [phone-login-entry.png](phone-login-entry.png)
- [ipad-current-head.mp4](ipad-current-head.mp4)
