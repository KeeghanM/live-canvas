import { Filter } from 'bad-words'
import { useState } from 'react'

interface LoginFormProps {
  onEnter: (name: string) => void
}
export default function LoginForm({ onEnter }: LoginFormProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)

  const filter = new Filter()

  const handleEnter = () => {
    setError(false)
    if (name.length < 3 || name.length > 20 || filter.isProfane(name)) {
      setError(true)
      return
    }

    onEnter(name)
  }
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleEnter}>Enter!</button>
      {error && <p>This name is invalid.</p>}
    </div>
  )
}
