export interface MarkerData {
  key: string
  name: string
  position: { x: number; y: number }
  color?: string
  notes?: string[]
  radius?: number
}

export type Character = {
  key: string
  name: string
  position: { x: number; y: number }
  color?: string
  notes?: string[]
}

export type Template = {
  key: string
  name: string
  position: { x: number; y: number }
  color?: string
  notes: string[]
  radius: number
}

export default MarkerData
