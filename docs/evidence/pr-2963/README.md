# PR 2963 visual evidence

Current head: `215862dcc43b6f12c706ddf60b87d511b5a3aeac`.
Before version: `9d500a2fc589aaa392cfebfe39fd1734083669af` (separate full checkout).

These are real Electron app screenshots in the light theme, with an isolated profile, local MongoDB/backend, and the repository's deterministic ACP fixture agent. The app and backend source trees were compared with the current PR head with no differences. Test-harness configuration sets the local public avatar origin; no React components, UI DOM, or product screens were mocked. Only generated sample content and a generated portrait PNG were used. The PNG was uploaded through the real Electron IPC and backend image endpoint.

The failure case uses a local HTTP/WebSocket/SSE reverse proxy that returns HTTP 503 for the avatar PATCH while allowing other traffic through. It delays the rejection so the optimistic state can be captured. Assertions verify the persisted name, unchanged uploaded photo after a name-only save, saved character name, unchanged persisted avatar after rejection, and Ada selected when the dialog reopens. Generic transport failures are suppressed by the existing toast policy; the failure screenshot shows the editor staying open and the background reverting to Ada, while Athena remains the unsaved draft.

Images 01-10 show the current head. Image 11 is the actual New Bot dialog from the before checkout, using the same theme, name, selected avatar, and window size.

- 01: New Bot after extracting the shared fields.
- 02: Name-only edit with an uploaded portrait.
- 03: Reopened editor after saving; new name and same portrait.
- 04: Select Ada from the grid.
- 05: Reopened editor after successfully saving Ada.
- 06: Athena appears optimistically in the background while Save is pending.
- 07: HTTP 503 has settled; the background is Ada again and the unsaved Athena draft remains in the open editor.
- 08: Close after the rejected save; the background remains Ada.
- 09: Reopen; Ada is selected, also confirmed in persisted backend data.
- 10: Task Rename still has the original name-only form.
- 11: New Bot before the refactor.

During the capture, switching from a photo to a character exposed an existing backend pruning exception. The current head adds a non-URL guard to hostedAvatarOwner and a regression test for character names and invalid URL strings. The four focused avatar tests pass, and the real photo-to-character save now completes.

The refreshed capture follows the main merge and the pinned Bot menu test update. Images 12 and 13 show Edit Bot and New Bot closed by pressing Escape with the name field focused. Both were asserted hidden in the real Electron app. The keyboard regression test confirms that Escape reaches the modal while ordinary keys and Enter stay local. The separate Change avatar menu action is retained because it also uploads photos.

## Capture hashes

- `01-new-bot-after.png`: `fbda6e6e30fe2cec1d8166349e7e8012237278c994e54a201685aaa1dd6123cc`
- `02-photo-name-edit.png`: `ac0f23c6125e24cfc503b64f04dd82c23ba76899c26963bc4c96ed7b6158ba10`
- `03-photo-preserved-after-save.png`: `90d95f34f6a3ed41f37da109ef60e12e62fd6b2cfb458a8824ac176220700807`
- `04-grid-selection.png`: `cb7a8d2d86bda2974db5d1d19b6ee1e527230c601e76d3b810099c283a51800c`
- `05-grid-saved.png`: `b5e7e39270f69f1624776ed159664299a6cebc380473830d2b14e16ff71f885d`
- `06-optimistic-in-flight.png`: `9fcd43064229bfec4a4464774aedb46b2bb2ac3dd5d5f4324999db137d4160c3`
- `07-avatar-save-failure.png`: `02d1cf6845e95aea7824f84a7dd1b3852a748e680d4c585a6e2ba7600f82bfbd`
- `08-avatar-rollback.png`: `5a842213e4cefdce2082e98a19f4efc9eed50df6fdb08bec54d7ae9d23077d68`
- `09-avatar-rollback-reopened.png`: `201b7789bf76020d1fe1e657cb17610764b42b4db6c1fe2bb905c2e081ac9c8f`
- `10-task-rename-unchanged.png`: `7f661fefc0bf1c65226d3331c9c3294b82ffff5a0325adeee7203def1809e8fe`
- `11-new-bot-before.png`: `3b88737df2696e25d99edbdcf3f7ce82e7af99bb0016781beea073d34b9c256d`
- `12-escape-edit-bot-closed.png`: `d03b51bff9c8d4e4099322c1c929e338f3597af60d7e0d10cec43301df8bf9ac`
- `13-escape-new-bot-closed.png`: `d31d4fec6fbbb62ef42201c3e360e80f9c0a7c49da3c3188d5f7d78149cab2a0`
