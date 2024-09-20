import { v4 as uuidv4 } from 'uuid'
import type { Sprite } from '../../../party/types'
import { useStore } from '../../store'
import useEmblaCarousel from 'embla-carousel-react'
import { spriteOptions } from './sprites'
import { useState } from 'react'
interface AdderProps {
  setSpriteId: (id: string) => void
}
export default function Adder({ setSpriteId }: AdderProps) {
  const [selectedSprite, setSelectedSprite] = useState<string | null>(null)
  const socket = useStore((state) => state.socket)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
  })

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
  return (
    <div
      className="embla"
      ref={emblaRef}
    >
      <div className="embla__container">
        {spriteOptions.map((sprite) => (
          <div
            className={`embla__slide ${
              selectedSprite === sprite.id ? 'selected' : ''
            }`}
            key={sprite.id}
          >
            <img
              src={`/images/${sprite.id}.png`}
              alt={sprite.label}
              onClick={() => setSelectedSprite(sprite.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
