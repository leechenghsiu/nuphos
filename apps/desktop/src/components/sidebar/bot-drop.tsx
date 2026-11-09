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
/**
 * A row being dragged follows the pointer as a small card, its face over its
 * name, instead of the browser's faded snapshot of the whole row.
 */
export function setRowDragImage(
  event: { dataTransfer: DataTransfer | null },
  row: HTMLElement,
  label: string,
) {
  const card = document.createElement('div')

  card.className =
    'fixed -left-[999px] top-0 flex w-[112px] flex-col items-center gap-1.5 rounded-xl border border-line-control bg-elevated px-3 py-2.5 shadow-lg'
  const icon = row.querySelector('button > span')?.cloneNode(true)

  if (icon instanceof HTMLElement) {
    icon.className = 'flex size-9 items-center justify-center [&>*]:!size-9 [&_svg]:!size-5'
    card.appendChild(icon)
  }
  const name = document.createElement('div')

  name.className = 'max-w-full truncate text-[12px] font-medium text-main'
  name.textContent = label
  card.appendChild(name)
  document.body.appendChild(card)
  event.dataTransfer?.setDragImage(card, 56, 24)
  requestAnimationFrame(() => card.remove())
}

export function ChatGroupDropZone({
  target,
  teamId,
  className,
  children,
}: {
  target: keyof typeof TARGETS | null
  teamId: string
  className?: string
  /** Renders the group; `slot` is where the drop hint opens, under the group's title. */
  children: (slot: ReactNode) => ReactNode
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

  if (!spec) return <div className={className}>{children(null)}</div>

  return (
    <div
      className={className}
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
      {children(
        // Opens under the title as the drag starts and closes when it ends, so
        // the rows below slide rather than jump; over it, the dashed edge firms up.
        <div className="t-collapse" data-open={dragging ? 'true' : 'false'}>
          <div className="t-collapse-inner">
            <div
              className={clsx(
                'mx-0.5 mb-1.5 mt-1 flex h-12 items-center justify-center rounded-xl border text-[12.5px] transition-colors duration-150',
                over
                  ? 'border-line-focus bg-state-hover text-secondary'
                  : 'border-dashed border-line-control text-tertiary',
              )}
            >
              {spec.hint()}
            </div>
          </div>
        </div>,
      )}
    </div>
  )
}
