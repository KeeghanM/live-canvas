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
  const name = useStore((state) => state.name)
  const [selectedSprite, setSelectedSprite] = useState<{
    id: string
    label: string
  } | null>(null)
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
    socket.send(
      JSON.stringify({
        type: 'add',
        payload: newSprite,
      })
    )
    setSpriteId(newSpriteId)
  }
  return (
    <div className="adder">
      <h1>
        Welcome, <span>{name}</span>!
      </h1>
      {selectedSprite ? (
        <div className="selected">
          <h2 className="selected__label">{selectedSprite.label}</h2>
          <img
            src={`/images/${selectedSprite}.png`}
            alt={selectedSprite.label}
          />
          <button onClick={addSprite}>Add to CanvasLive</button>
        </div>
      ) : (
        <p>Select an image from below to add it to CanvasLive!</p>
      )}
      <div
        className="embla"
        ref={emblaRef}
      >
        <div className="embla__container">
          {spriteOptions.map((sprite) => (
            <div
              className={`embla__slide ${
                selectedSprite?.id === sprite.id ? 'selected' : ''
              }`}
              key={sprite.id}
            >
              <img
                src={`/images/${sprite.id}.png`}
                alt={sprite.label}
                onClick={() => setSelectedSprite(sprite)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
