import { useCanvasStore } from '../../canvas-store'

const UserMessages = () => {
  const names = useCanvasStore((state) => state.names)

  return (
    <div className="user-messages">
      {names.map((name) => (
        <p key={name}>{name} has joined the party!</p>
      ))}
    </div>
  )
}

export default UserMessages
