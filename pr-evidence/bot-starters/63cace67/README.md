# Bot starters: UI review evidence

Source head: 63cace67231cb57e2396701b968f165c34da44ca

These light-theme captures render the actual NewChatButton, ChannelEmptyState and
Typing components from that head. They isolate the reviewed surfaces; surrounding
application chrome and the composer are omitted. The fixture supplies a connected
runtime, a synthetic active snapshot, and an onboarding handoff failure. It never
connects to production and is not end-to-end or latency evidence.

To reproduce, check out the source head, copy fixture/ to apps/desktop/.review-fixture/,
install locked dependencies, and run Vite with --config .review-fixture/vite.config.ts.
Open ?state=form-default or ?state=form-coordinate, open New Bot and enter a name.
Toggle the coordination checkbox for the second view. For ?state=retry-setup,
submit the form: the fixture rejects onboarding after Bot/channel creation, so
Retry setup appears. The other states are ?state=empty-preparing and
?state=empty-failed. Waiting uses the actual existing three-dot animation.
