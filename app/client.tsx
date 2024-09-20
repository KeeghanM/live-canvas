import './styles.css'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import LoginForm from './components/ui/login-form'
import Canvas from './components/canvas/canvas'

function App() {
  const [name, setName] = useState('Keeghan')

  return (
    <main>
      {name ? (
        <Canvas name={name} />
      ) : (
        <LoginForm
          onEnter={(name) => {
            setName(name)
          }}
        />
      )}
    </main>
  )
}

createRoot(document.getElementById('app')!).render(<App />)
