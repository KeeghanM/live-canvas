export interface Sprite {
  id: string
  type: string
  owner: string
  x: number
  y: number
}
export interface SpritesMessage {
  type: 'sprites'
  payload: Sprite[]
}
export interface NamesMessage {
  type: 'names'
  payload: string[]
}
export interface ConnectionMessage {
  type: 'connected'
  payload: string
}
export interface UpdateMessage {
  type: 'add' | 'remove'
  payload: Sprite
}
export interface DisconnectMessage {
  type: 'disconnected'
  payload: string
}
export interface NameValidationMessage {
  type: 'validateName'
  payload: string
}
export interface MoveMessage {
  type: 'move'
  payload: {
    id: string
    dx: number
    dy: number
  }
}
