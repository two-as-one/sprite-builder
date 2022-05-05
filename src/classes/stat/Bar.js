export class Bar {
  constructor(owner, name, max) {
    this.__owner = owner
    this.__name = name
    this.__max = max
    this.__value = max
  }

  get name() {
    return this.__name
  }

  get value() {
    return this.__value
  }

  set value(val) {
    this.__value = Math.max(0, Number(val))

    console.log(`${this.__owner.name}[${this.name}:${this.value}/${this.max}]`)
  }

  get max() {
    return this.__max
  }

  set max(val) {
    this.value += val - this.__max
    this.__max = val
  }

  get percent() {
    return this.value / this.max
  }
}
