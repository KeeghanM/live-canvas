import { useState, useRef, useEffect } from 'react'
import Adder from './adder'
import Mover from './mover'

export default function UserView() {
  const [spriteId, setSpriteId] = useState<string | null>(null)

  return spriteId ? (
    <Mover
      spriteId={spriteId}
      done={() => setSpriteId(null)}
    />
  ) : (
    <Adder setSpriteId={setSpriteId} />
  )
}
