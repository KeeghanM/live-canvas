import { v4 as uuidv4 } from 'uuid'
import { useState, useRef, useEffect } from 'react'
import type { Sprite } from '../../../party/types'
import { useStore } from '../../store'

interface AdderProps {
  setSpriteId: (id: string) => void
}
export default function Adder({ setSpriteId }: AdderProps) {
  const socket = useStore((state) => state.socket)
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
  return <button onClick={addSprite}>Add</button>
}
