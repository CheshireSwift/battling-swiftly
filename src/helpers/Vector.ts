export class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  difference(other: Vector): Vector {
    return new Vector(other.x - this.x, other.y - this.y)
  }

  length(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  suffix(suffix: string) {
    return {
      ['x' + suffix]: this.x,
      ['y' + suffix]: this.y,
    }
  }
}
