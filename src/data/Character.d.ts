export type Character = {
  key: string
  name: string
  position: { x: number; y: number }
  color?: string
  notes?: string[]
}

export default Character
