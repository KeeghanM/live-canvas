import type * as Party from 'partykit/server'
import type {
  Sprite,
  ConnectionMessage,
  UpdateMessage,
  SpriteMessage,
} from './types'

export default class Server implements Party.Server {
  sprites: Sprite[] = []

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // get the client's name from the connection
    const name = ctx.request.headers.get('name')
    if (!name) {
      return
    }

    // send the current sprites to the new client
    const spritesMsg: SpriteMessage = { type: 'sprites', payload: this.sprites }
    conn.send(JSON.stringify(spritesMsg))

    // broadcast the new connection to all clients
    const msg: ConnectionMessage = { type: 'connected', payload: name }
    this.room.broadcast(JSON.stringify(msg), [conn.id])
  }

  onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message) as UpdateMessage
    if (msg.type === 'add') {
      this.addSprite(msg.payload)
    } else if (msg.type === 'remove') {
      this.removeSprite(msg.payload)
    }
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
