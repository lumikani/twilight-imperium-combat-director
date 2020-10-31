type Combat = number
type Capacity = number
type HasSustainDamage = boolean

interface Ship {
  combat: Combat
  hasSustainDamage: HasSustainDamage
  capacity: Capacity
}

type Fleet = Ship[]
