import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { api } from '../../api'
import { t } from '../../i18n'
import { pickAgentAvatar } from '../../lib/agentAvatarChoices'
import { makeBot } from '../channels/botChannel'
import { toast } from '../ui/toast'

import type { ReactNode } from 'react'

/** Set on a Task row's drag when it can become a Bot; its value is the session id. */
export const MAKE_BOT_DRAG_TYPE = 'application/x-nuphos-make-bot'
/** Set on a Bots row's drag when the viewer can turn that Bot back into a Task. */
export const MAKE_TASK_DRAG_TYPE = 'application/x-nuphos-make-task'

/** What dropping on a group does, as the menus' "Make this a Bot" and "Turn into a Task". */
const TARGETS = {
  bots: {
    type: MAKE_BOT_DRAG_TYPE,
    hint: () => t('Drop to make it a Bot'),
    drop: (teamId: string, sessionId: string) => void makeBot(teamId, sessionId),
  },
  tasks: {
    type: MAKE_TASK_DRAG_TYPE,
    hint: () => t('Drop to make it a Task'),
    drop: (teamId: string, sessionId: string) =>
      void pickAgentAvatar(sessionId, null, () =>
        api.agentSetConversationAvatar(sessionId, null, teamId),
      ).catch((err: unknown) => toast.apiError(t('Could not change avatar'), err)),
  },
} as const

/**
 * A sidebar group as a drop target: a Task dropped on Bots becomes a Bot, and
 * a Bot dropped on Tasks becomes a Task. While such a drag is under way the
 * group shows where to drop; over it, it lights up. Other groups render as a
 * plain wrapper.
 */
export function ChatGroupDropZone({
  target,
  teamId,
  className,
  children,
}: {
  target: keyof typeof TARGETS | null
  teamId: string
  className?: string
  children: ReactNode
}) {
  const [dragging, setDragging] = useState(false)
  const [over, setOver] = useState(false)
  const spec = target ? TARGETS[target] : null
  const type = spec?.type

  useEffect(() => {
    if (!type) return
    const start = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes(type)) setDragging(true)
    }
    const end = () => {
      setDragging(false)
      setOver(false)
    }

    window.addEventListener('dragstart', start)
    window.addEventListener('dragend', end)
    window.addEventListener('drop', end)

    return () => {
      window.removeEventListener('dragstart', start)
      window.removeEventListener('dragend', end)
      window.removeEventListener('drop', end)
    }
  }, [type])

  if (!spec) return <div className={className}>{children}</div>

  return (
    <div
      className={clsx(
        className,
        'relative rounded-xl -outline-offset-1 transition-colors duration-150',
        // A dashed edge says where the row can go; over it, the edge firms up and the group fills.
        dragging && !over && 'outline-dashed outline-1 outline-line-control',
        over && 'bg-state-hover outline outline-1 outline-line-focus',
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes(spec.type)) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setOver(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(false)
      }}
      onDrop={(event) => {
        const sessionId = event.dataTransfer.getData(spec.type)

        if (!sessionId) return
        event.preventDefault()
        event.stopPropagation()
        setDragging(false)
        setOver(false)
        spec.drop(teamId, sessionId)
      }}
    >
      {children}
      {dragging && (
        <div className="pointer-events-none px-2 pb-1.5 pt-1 text-[12.5px] text-tertiary">
          {spec.hint()}
        </div>
      )}
    </div>
  )
}
