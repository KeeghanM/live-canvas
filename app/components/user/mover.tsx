import { useRef, useEffect } from 'react'
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
    <div className="mover">
      <button
        className="tc"
        onMouseDown={() => handleMoveStart(0, -10)}
        onMouseUp={handleMoveEnd}
        onMouseLeave={handleMoveEnd}
      >
        ↑
      </button>
      <button
        className="ml"
        onMouseDown={() => handleMoveStart(-10, 0)}
        onMouseUp={handleMoveEnd}
        onMouseLeave={handleMoveEnd}
      >
        ←
      </button>
      <button
        className="mc"
        onClick={done}
      >
        Done
      </button>
      <button
        className="mr"
        onMouseDown={() => handleMoveStart(10, 0)}
        onMouseUp={handleMoveEnd}
        onMouseLeave={handleMoveEnd}
      >
        →
      </button>
      <button
        className="bc"
        onMouseDown={() => handleMoveStart(0, 10)}
        onMouseUp={handleMoveEnd}
        onMouseLeave={handleMoveEnd}
      >
        ↓
      </button>
    </div>
  )
}
