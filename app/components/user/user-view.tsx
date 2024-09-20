import { useState } from 'react'
import Adder from './adder'
import Mover from './mover'
import { useStore } from '../../store'

export default function UserView() {
  const name = useStore((state) => state.name)

  return (
    <div className="user-view">
      <h1>
        Welcome, <span>{name}</span>!
      </h1>
      <Adder />
    </div>
  )
}
