# PR 2963 visual evidence

Current head: `7a4791351e2f6cee70b3e2a538bec366fa7bfe81`.
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

## Capture hashes

- `01-new-bot-after.png`: `b1382199ae9eeb9bdafeb47a0651a86338b56d250e7997d8f5a2f55350728d44`
- `02-photo-name-edit.png`: `a17300d19863a5172493462ff9a74eaadc995764ddc2647dd3c95e42bde51467`
- `03-photo-preserved-after-save.png`: `2f3e2610e1f7c94be8c8427f01472e72944c323a65be9fefaf057e33dcae8066`
- `04-grid-selection.png`: `c29bae283cd10b33556a3841d014b39bc461cbfddb40324dc5efcb347b828885`
- `05-grid-saved.png`: `24e5c2f5df31a6915807eaba3344f183346833d9d88be622d2c8cf2202755f83`
- `06-optimistic-in-flight.png`: `ef6253b6f600f514890cfe4d33da9e8f40039398dfc8e09a17b989e4af9d0c30`
- `07-avatar-save-failure.png`: `2fbf2b59503d95d680a1b1bef1665dff57e81da53baf71df601aa0785b3b3090`
- `08-avatar-rollback.png`: `02ad8fc94d7c892c374b71d471a925995f510782de9f7eadc8aa3dfa0bc7b4fd`
- `09-avatar-rollback-reopened.png`: `24e5c2f5df31a6915807eaba3344f183346833d9d88be622d2c8cf2202755f83`
- `10-task-rename-unchanged.png`: `dca224f8a9ff214b8d82a9433e1936e9c2562c420b337b044f1cc62560175246`
- `11-new-bot-before.png`: `3b88737df2696e25d99edbdcf3f7ce82e7af99bb0016781beea073d34b9c256d`
