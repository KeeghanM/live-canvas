import { Filter } from 'bad-words'
import { useState } from 'react'
import { useCanvasStore } from '../../canvas-store'

export default function LoginForm() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const socket = useCanvasStore((state) => state.socket)
  const setStoreName = useCanvasStore((state) => state.setName)

  const filter = new Filter()

  const handleEnter = () => {
    setError('')
    if (name.length < 3 || name.length > 20 || filter.isProfane(name)) {
      setError('This name is invalid.')
      return
    }

    setIsValidating(true)
    socket?.send(JSON.stringify({ type: 'validateName', payload: name }))
  }

  if (socket) {
    socket.onmessage = (evt) => {
      const data = JSON.parse(evt.data)
      console.log(data)
      if (data.type === 'nameValidated') {
        if (data.payload) {
          setStoreName(name)
        } else {
          setError('This name is already taken.')
          setIsValidating(false)
        }
      }
    }
  }

  return (
    <div className="login-form">
      <div className="login-form__center">
        <h1>Login to Live Canvas</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isValidating}
          />
          <button
            onClick={handleEnter}
            disabled={isValidating || !socket}
          >
            {isValidating ? 'Validating...' : 'Enter!'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}
