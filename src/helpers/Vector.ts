export class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static fromXY({ x, y }: { x: number; y: number }) {
    return new Vector(x, y)
  }

  static fromEvent(e: { pageX: number; pageY: number }) {
    return new Vector(e.pageX, e.pageY)
  }

  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  difference(other: Vector): Vector {
    return new Vector(other.x - this.x, other.y - this.y)
  }

  length(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  normalize(xMult: number = 1, yMult?: number): Vector {
    if (yMult == null) {
      yMult = xMult
    }

    const length = this.length()

    return length === 0
      ? new Vector(0, 0)
      : new Vector((this.x * xMult) / length, (this.y * yMult) / length)
  }

  cap(maxLength: number): Vector {
    return this.length() > maxLength ? this.normalize(maxLength) : this
  }

  multiply(mult: number): Vector {
    return new Vector(this.x * mult, this.y * mult)
  }

  toStyle() {
    return { top: this.y, left: this.x }
  }

  toXY() {
    return { x: this.x, y: this.y }
  }

  toString() {
    return `${Math.round(this.x)},${Math.round(this.y)}`
  }

  prefix(prefix: string) {
    return {
      [prefix + 'x']: this.x,
      [prefix + 'y']: this.y,
    }
  }

  suffix(suffix: string) {
    return {
      ['x' + suffix]: this.x,
      ['y' + suffix]: this.y,
    }
  }
}

export default Vector
