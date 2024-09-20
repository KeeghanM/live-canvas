import { v4 as uuidv4 } from 'uuid'
import { useState, useRef, useEffect } from 'react'
import type { Sprite } from '../../../party/types'
import { useStore } from '../../store'

export default function SpriteControl() {
  const socket = useStore((state) => state.socket)
  const [spriteId, setSpriteId] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  const addSprite = () => {
    if (!socket) return
    const newSpriteId = uuidv4()
    const newSprite: Sprite = {
      id: newSpriteId,
      owner: socket.id,
      x: 0,
      y: 0,
      type: 'violin',
    }
    setSpriteId(newSpriteId)
    socket.send(
      JSON.stringify({
        type: 'add',
        payload: newSprite,
      })
    )
  }

  const doneWithSprite = () => {
    setSpriteId(null)
  }

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
    <div style={{ padding: '10px' }}>
      {!spriteId ? (
        <button onClick={addSprite}>Add</button>
      ) : (
        <>
          <button onClick={doneWithSprite}>Done</button>
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
      )}
    </div>
  )
}
