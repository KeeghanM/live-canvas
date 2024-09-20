export interface Sprite {
  type: string
  owner: string
  x: number
  y: number
}
export interface SpriteMessage {
  type: 'sprites'
  payload: Sprite[]
}
export interface ConnectionMessage {
  type: 'connected'
  payload: string
}
export interface UpdateMessage {
  type: 'add' | 'remove'
  payload: Sprite
}
