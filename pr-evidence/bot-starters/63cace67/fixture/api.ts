export const api = new Proxy({}, {get: (_target, key) => {
  if (key === 'agentCreateBot') return async (_team: string, input: object) => ({sessionId:'review-bot',...input})
  if (key === 'agentCreateChannel') return async () => ({sessionId:'review-chat'})
  if (key === 'agentStartBotOnboarding') return async () => {throw new Error('Review fixture: onboarding handoff unavailable')}
  if (String(key).startsWith('on')) return () => () => {}
  return async () => []
}})

export * from "../src/api/errors"
export const onSessionRejected = () => {}
