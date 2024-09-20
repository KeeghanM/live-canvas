import './styles.css'
import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import LoginForm from './components/ui/login-form'
import Canvas from './components/canvas/canvas'
import { useCanvasStore } from './canvas-store'
import usePartySocket from 'partysocket/react'

function App() {
  const name = useCanvasStore((state) => state.name)
  const setSocket = useCanvasStore((state) => state.setSocket)
  const setSprites = useCanvasStore((state) => state.setSprites)
  const addSprite = useCanvasStore((state) => state.addSprite)
  const removeSprite = useCanvasStore((state) => state.removeSprite)
  const addName = useCanvasStore((state) => state.addName)

  const socket = usePartySocket({
    room: 'live-canvas',
    onMessage(evt) {
      const data = JSON.parse(evt.data)
      if (data.type === 'sprites') {
        setSprites(data.payload)
      } else if (data.type === 'add') {
        if (data.payload.owner === socket.id) return
        addSprite(data.payload)
      } else if (data.type === 'remove') {
        removeSprite(data.payload)
      } else if (data.type === 'userJoined') {
        if (data.payload === name) return
        addName(data.payload)
      }
    },
  })

  useEffect(() => {
    if (socket) {
      setSocket(socket)
    }
  }, [socket, setSocket])

  return <main>{name ? <Canvas name={name} /> : <LoginForm />}</main>
}

createRoot(document.getElementById('app')!).render(<App />)
