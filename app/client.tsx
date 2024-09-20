import './styles.css'
import { createRoot } from 'react-dom/client'
import LoginForm from './components/ui/login-form'
import Canvas from './components/canvas/canvas'
import { useStore } from './store'
import Adder from './components/adder/adder'
import usePartySocket from 'partysocket/react'
import { useEffect } from 'react'

function App() {
  const name = useStore((state) => state.name)
  const setSocket = useStore((state) => state.setSocket)

  const socket = usePartySocket({
    room: 'canvas-live',
  })

  useEffect(() => {
    if (socket) {
      setSocket(socket)
    }
  }, [socket, setSocket])

  if (!name) return <LoginForm />

  if (name === 'admin') return <Canvas />

  return <Adder />
}

createRoot(document.getElementById('app')!).render(<App />)
