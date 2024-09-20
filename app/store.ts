import type PartySocket from 'partysocket'
import { create } from 'zustand'

interface Store {
  socket: PartySocket | null
  name: string
  names: string[]
  setSocket: (socket: PartySocket) => void
  setName: (name: string) => void
  addName: (name: string) => void
}

export const useStore = create<Store>((set) => ({
  socket: null,
  name: '',
  names: [],
  namesToShow: [],
  setSocket: (socket) => set({ socket }),
  setName: (name) => set({ name }),
  addName: (name) => {
    // Add the name to the list of names
    set((state) => ({ names: [...state.names, name] }))

    setTimeout(() => {
      set((state) => ({
        names: state.names.filter((n) => n !== name),
      }))
    }, 5000)
  },
}))
