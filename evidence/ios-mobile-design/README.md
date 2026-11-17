# iOS mobile workspace visual review

Source revision: `664e6f87e89c63b504d040851bb76b4b795f9a13`, based on main `07edf331207f9b567c21f05ddf5ed60c85ff4e1c`.

All captures use isolated synthetic fixtures. No customer account, real task, or production mutation is included.

## Recordings

- [iPhone navigation](phone-navigation.mp4): manually open New Task, cancel it, preview a pinned Bot, and open account controls. Trimmed before the profile editor; its final appearance is shown separately.
- [iPad task summary](ipad-summary.mp4): manually open the native inspector, inspect a pending question without answering, expand background work, and close the inspector.
- [Duo create menu](duo-create-menu.mp4): manually open the native New Bot / New Task menu on the folded display. Folded and unfolded states are shown in the screenshots; this clip does not record the physical fold transition.

Recordings are silent, resized, and played at 1.5x. Screenshots are unedited simulator captures, including XCTest attachments.

## Test environments

- iPhone 17 Pro, iOS 26.4: final selected suite 16/16 passed.
- iPad Pro 13-inch M5, iPadOS 26.4: eight distinct selected cases passed across focused runs, including both final inspector cases.
- iPhone Duo, iOS 27.1: four distinct selected cases passed; the Bot Task return case was rerun after updating the native BackButton query.
- PreviewIsolation regression: baseline fails explicitly clearing persisted fixture mode; updated implementation passes.

Rendering and navigation are covered with offline fixtures. Production OAuth, account creation/deletion, real pin/archive mutations, purchases, and managed-runtime provisioning were not exercised by these captures. Mobile paywall work is outside this change.

## Screenshots

- [phone-account](phone-account.png)
- [phone-account-footer](phone-account-footer.png)
- [phone-login](phone-login.png)
- [phone-new-task-draft](phone-new-task-draft.png)
- [phone-no-runtime](phone-no-runtime.png)
- [phone-workspace-setup](phone-workspace-setup.png)
- [phone-pin-preview](phone-pin-preview.png)
- [phone-list-menu](phone-list-menu.png)
- [phone-task-summary](phone-task-summary.png)
- [phone-bot-task-return](phone-bot-task-return.png)
- [ipad-task-summary](ipad-task-summary.png)
- [ipad-task-summary-empty](ipad-task-summary-empty.png)
- [ipad-edit-profile](ipad-edit-profile.png)
- [duo-closed](duo-closed.png)
- [duo-team-switcher](duo-team-switcher.png)
