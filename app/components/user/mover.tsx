import { v4 as uuidv4 } from 'uuid'
import { useState, useRef, useEffect } from 'react'
import type { Sprite } from '../../../party/types'
import { useStore } from '../../store'

interface MoverProps {
  spriteId: string
  done: () => void
}
export default function Mover({ spriteId, done }: MoverProps) {
  const socket = useStore((state) => state.socket)
  const intervalRef = useRef<number | null>(null)

  const moveSprite = (dx: number, dy: number) => {
    if (!socket || !spriteId) return

    socket.send(
      JSON.stringify({
        type: 'move',
        payload: {
          id: spriteId,
          dx,
          dy,
        },
      })
    )
  }

  const handleMoveStart = (dx: number, dy: number) => {
    moveSprite(dx, dy)
    intervalRef.current = window.setInterval(() => moveSprite(dx, dy), 100)
  }

  const handleMoveEnd = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <>
      <button onClick={done}>Done</button>
      <div style={{ marginTop: '10px' }}>
        <button
          onMouseDown={() => handleMoveStart(0, -10)}
          onMouseUp={handleMoveEnd}
          onMouseLeave={handleMoveEnd}
        >
          ↑
        </button>
        <br />
        <button
          onMouseDown={() => handleMoveStart(-10, 0)}
          onMouseUp={handleMoveEnd}
          onMouseLeave={handleMoveEnd}
        >
          ←
        </button>
        <button
          onMouseDown={() => handleMoveStart(10, 0)}
          onMouseUp={handleMoveEnd}
          onMouseLeave={handleMoveEnd}
        >
          →
        </button>
        <br />
        <button
          onMouseDown={() => handleMoveStart(0, 10)}
          onMouseUp={handleMoveEnd}
          onMouseLeave={handleMoveEnd}
        >
          ↓
        </button>
      </div>
    </>
  )
}
