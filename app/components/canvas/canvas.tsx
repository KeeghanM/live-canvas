import { useState } from 'react'
import usePartySocket from 'partysocket/react'
import type { Sprite } from '../../../party/types'

interface CanvasProps {
  name: string
}
export default function Canvas({ name }: CanvasProps) {
  const [sprites, setSprites] = useState<Sprite[]>([])

  const socket = usePartySocket({
    //host: process.env.PARTYKIT_HOST,
    room: 'live-canvas',
    query: { name },
    onMessage(evt) {
      const data = JSON.parse(evt.data)

      if (data.type === 'sprites') {
        // Set the list of sprites
        setSprites(data.payload)
      } else if (data.type === 'add') {
        // Add the sprite to the list
        setSprites((prev) => [...prev, data.payload])
      } else if (data.type === 'remove') {
        // Remove the sprite from the list
        setSprites((prev) => prev.filter((s) => s !== data.payload))
      } else if (data.type === 'connected') {
        // User has connected, do something
        console.log(data.payload)
      }
    },
  })

  return <></>
}
