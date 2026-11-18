# iOS hosted Bot photo avatars — #2825

Base: 4335239985a846c9b729ad7db3831a2c73f5134f, with local changes listed in files.json.

The current backend origin and canonical uploaded-avatar path are required. Userinfo, query, fragment, other origins/ports and encoded paths are rejected; default ports match the backend origin. Trusted images render inside a circle with the existing runtime badge. Loading/failure and catalog names use the existing derived/catalog avatars. No photo motion is added.

Verified locally on iOS/iPadOS26.4:
- iPhone: final WebP pixel test passed. A synthetic solid red WebP must appear in the photo region; the failed-photo row must not reuse it.
- iPad: final WebP pixel test plus existing pinned-shelf/unpin/context-menu case passed (2/2).
- Existing apps/ios/tests/run.sh passed, including the new offline URL-trust tests.
- Simulator build and git diff --check passed.

The retained screenshot was inspected: a red circle and a distinct catalog-avatar fallback, both with runtime marks. The fixture is a solid color, not a person's photo. Visual inspection establishes the fallback picture; the negative pixel assertion alone would also accept a blank fallback. PreviewTransport's optional base64 body exists only in DEBUG and enables real WebP decoding without a network server.

Limits: Android, uploads, push-notification photos, real hosted servers, live account changes, the avatars-disabled preference and manual VoiceOver were not exercised here. The earliest iPad bundle named photo-webp-ipad.xcresult actually used PNG because an encoder was absent; it is not counted as WebP evidence. The later actual-WebP and final runs used validated RIFF/WEBP bytes.

No PR or remote commit yet. The issue stays open for Android; a proposed iOS PR should reference #2825 rather than close both platforms.
