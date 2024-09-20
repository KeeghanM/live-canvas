import { useStore } from '../../store'

const UserMessages = () => {
  const names = useStore((state) => state.names)

  return (
    <div className="user-messages">
      {names.map((name) => (
        <p key={name}>{name} has joined the party!</p>
      ))}
    </div>
  )
}

export default UserMessages
