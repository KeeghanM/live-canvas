import type * as Party from 'partykit/server'
import type {
  Sprite,
  ConnectionMessage,
  UpdateMessage,
  SpriteMessage,
  NameValidationMessage,
} from './types'

// TODO: Remove names on disconnect - this will require a Map of connections to names & a new event
export default class Server implements Party.Server {
  sprites: Sprite[] = []
  names: string[] = []

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // Send the current sprites to the new client
    const spritesMsg: SpriteMessage = { type: 'sprites', payload: this.sprites }
    conn.send(JSON.stringify(spritesMsg))
  }

  onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message) as
      | UpdateMessage
      | ConnectionMessage
      | NameValidationMessage
    if (msg.type === 'validateName') {
      this.validateName(msg.payload, sender)
    } else if (msg.type === 'add') {
      this.addSprite(msg.payload)
    } else if (msg.type === 'remove') {
      this.removeSprite(msg.payload)
    }
  }

  validateName(name: string, sender: Party.Connection) {
    if (this.isNameValid(name)) {
      this.names.push(name)
      sender.send(JSON.stringify({ type: 'nameValidated', payload: true }))
      this.broadcastJoin(name)
    } else {
      sender.send(JSON.stringify({ type: 'nameValidated', payload: false }))
    }
  }

  isNameValid(name: string): boolean {
    return name.length >= 3 && name.length <= 20 && !this.names.includes(name)
  }

  broadcastJoin(name: string) {
    this.room.broadcast(JSON.stringify({ type: 'userJoined', payload: name }))
  }

  addSprite(sprite: Sprite) {
    this.sprites.push(sprite)
    this.room.broadcast(JSON.stringify({ type: 'add', payload: sprite }))
  }

  removeSprite(sprite: Sprite) {
    this.sprites = this.sprites.filter((s) => s !== sprite)
    this.room.broadcast(JSON.stringify({ type: 'remove', payload: sprite }))
  }
}

Server satisfies Party.Worker
