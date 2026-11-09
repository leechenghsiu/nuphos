import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { t } from '../../i18n'
import { makeBot } from '../channels/botChannel'

import type { ReactNode } from 'react'

/** Set on a Task row's drag when it can become a Bot; its value is the session id. */
export const MAKE_BOT_DRAG_TYPE = 'application/x-nuphos-make-bot'

/**
 * The Bots group as a drop target: a Task dragged onto it becomes a Bot, as
 * "Make this a Bot" does. While such a drag is under way the group shows where
 * to drop; over it, it lights up. Other groups render as a plain wrapper.
 */
export function BotDropZone({
  enabled,
  teamId,
  className,
  children,
}: {
  enabled: boolean
  teamId: string
  className?: string
  children: ReactNode
}) {
  const [dragging, setDragging] = useState(false)
  const [over, setOver] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const start = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes(MAKE_BOT_DRAG_TYPE)) setDragging(true)
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
  }, [enabled])

  if (!enabled) return <div className={className}>{children}</div>

  return (
    <div
      className={clsx(
        className,
        'relative rounded-xl transition-[background-color,box-shadow] duration-150',
        dragging && 'shadow-[inset_0_0_0_1px_var(--sidebar-overlay-active)]',
        over &&
          'bg-[var(--sidebar-overlay-hover)] shadow-[inset_0_0_0_1.5px_rgb(var(--color-line-focus))]',
      )}
      onDragOver={(event) => {
        if (!event.dataTransfer.types.includes(MAKE_BOT_DRAG_TYPE)) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setOver(true)
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(false)
      }}
      onDrop={(event) => {
        const sessionId = event.dataTransfer.getData(MAKE_BOT_DRAG_TYPE)

        if (!sessionId) return
        event.preventDefault()
        event.stopPropagation()
        setDragging(false)
        setOver(false)
        void makeBot(teamId, sessionId)
      }}
    >
      {children}
      {dragging && (
        <div className="pointer-events-none px-2 pb-1.5 pt-1 text-[12.5px] text-tertiary">
          {t('Drop to make it a Bot')}
        </div>
      )}
    </div>
  )
}
