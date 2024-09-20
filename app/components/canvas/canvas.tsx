import { useEffect, useRef, useState } from 'react'
import usePartySocket from 'partysocket/react'
import { type P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react'
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
        // Add the sprite to the list if it's not one of ours
        if (data.payload.owner === socket.id) return
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

  const sketch = (p: P5CanvasInstance) => {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
    }
    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight)

    p.mousePressed = () => {
      const newSprite = {
        type: 'sprite',
        owner: socket.id,
        x: p.mouseX,
        y: p.mouseY,
      }
      setSprites((prev) => [...prev, newSprite])
      socket.send(JSON.stringify({ type: 'add', payload: newSprite }))
    }

    p.draw = () => {
      p.background('#03061f')

      for (const sprite of sprites) {
        p.fill(255)
        p.ellipse(sprite.x, sprite.y, 50, 50)
      }
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}
