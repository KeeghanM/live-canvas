import { create } from 'zustand'
import type { Sprite } from '../party/types'
import type PartySocket from 'partysocket'

interface CanvasStore {
  name: string
  names: string[]
  socket: PartySocket | null
  sprites: Sprite[]
  setName: (name: string) => void
  addName: (name: string) => void
  setSocket: (socket: PartySocket) => void
  setSprites: (sprites: Sprite[]) => void
  addSprite: (sprite: Sprite) => void
  removeSprite: (sprite: Sprite) => void
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  name: '',
  names: [],
  socket: null,
  sprites: [],
  setName: (name) => set({ name }),
  addName: (name) => {
    // Add the name to the list of names
    set((state) => ({ names: [...state.names, name] }))
    // Remove the name after 5 seconds
    setTimeout(() => {
      set((state) => ({ names: state.names.filter((n) => n !== name) }))
    }, 5000)
  },
  setSocket: (socket) => set({ socket }),
  setSprites: (sprites) => set({ sprites }),
  addSprite: (sprite) =>
    set((state) => ({ sprites: [...state.sprites, sprite] })),
  removeSprite: (sprite) =>
    set((state) => ({ sprites: state.sprites.filter((s) => s !== sprite) })),
}))
