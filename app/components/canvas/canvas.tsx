import { type P5CanvasInstance, ReactP5Wrapper } from '@p5-wrapper/react'
import type { Sprite } from '../../../party/types'
import { useCanvasStore } from '../../canvas-store'
import UserMessages from './user-messages'

interface CanvasProps {
  name: string
}
export default function Canvas({ name }: CanvasProps) {
  const sprites = useCanvasStore((state) => state.sprites)
  const addSprite = useCanvasStore((state) => state.addSprite)
  const removeSprite = useCanvasStore((state) => state.removeSprite)
  const socket = useCanvasStore((state) => state.socket)

  if (!socket) return null

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
      addSprite(newSprite)
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

  return (
    <>
      <ReactP5Wrapper sketch={sketch} />
      <UserMessages />
    </>
  )
}
