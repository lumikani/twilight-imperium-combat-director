import {
  Capacity,
  CombatValue,
  Fleet,
  HasSustainDamage,
  Ship,
} from './appStates/fleetSetupState'

export const createShip = (
  combatValue: CombatValue,
  hasSustainDamage: HasSustainDamage,
  capacity: Capacity
): Ship => ({
  combatValue,
  hasSustainDamage,
  capacity,
})

const range = (end: number) => Array.from({ length: end }, (_, i) => i)

export const createFleet = (
  shipsQuantity: number,
  shipsCombatValue: CombatValue,
  shipsHaveSustainDamage: HasSustainDamage,
  shipsCapacity: Capacity
): Fleet => {
  return range(shipsQuantity).map(() =>
    createShip(shipsCombatValue, shipsHaveSustainDamage, shipsCapacity)
  )
}
