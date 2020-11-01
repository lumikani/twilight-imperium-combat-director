import { Store, addAttackerFleet } from '../store/store'
import { AppState } from '..'

export const STATE_NAME = 'FLEET_SETUP_STATE'
export const SHIPS_QUANTITY = 'SHIPS_QUANTITY'
export const SHIPS_COMBAT_VALUE = 'SHIPS_COMBAT_VALUE'
export const SHIPS_HAVE_SUSTAIN_DAMAGE = 'SHIPS_HAVE_SUSTAIN_DAMAGE'
export const SHIPS_CAPACITY = 'SHIPS_CAPACITY'
export const ADD_ANOTHER_FLEET = 'ADD_ANOTHER_FLEET'

const fleetSetupStateParameters: string[] = [
  SHIPS_QUANTITY,
  SHIPS_COMBAT_VALUE,
  SHIPS_HAVE_SUSTAIN_DAMAGE,
  SHIPS_CAPACITY,
  ADD_ANOTHER_FLEET,
]

const createShip = (
  combat: Combat,
  hasSustainDamage: HasSustainDamage,
  capacity: Capacity
): Ship => ({
  combat,
  hasSustainDamage,
  capacity,
})

const range = (end: number) => Array.from({ length: end }, (_, i) => i)

interface FleetSetupStateParametersType {
  [SHIPS_QUANTITY]: number
  [SHIPS_COMBAT_VALUE]: number
  [SHIPS_HAVE_SUSTAIN_DAMAGE]: boolean
  [SHIPS_CAPACITY]: number
  [ADD_ANOTHER_FLEET]: boolean
}

const doTheThing = (
  state: Store,
  parameters: FleetSetupStateParametersType
): [Store, string] => {
  const shipsQuantity = parameters[SHIPS_QUANTITY]
  const shipsCombatValue = parameters[SHIPS_COMBAT_VALUE]
  const shipsHaveSustainDamage = parameters[SHIPS_HAVE_SUSTAIN_DAMAGE]
  const shipsCapacity = parameters[SHIPS_CAPACITY]
  const addAnotherFleet = parameters[ADD_ANOTHER_FLEET]
  const newFleet = range(shipsQuantity).map(() =>
    createShip(shipsCombatValue, shipsHaveSustainDamage, shipsCapacity)
  )

  const nextDataState = addAttackerFleet(state, newFleet)

  const nextAppState = addAnotherFleet ? STATE_NAME : ''
  return [nextDataState, nextAppState]
}

const fleetAppState: AppState = {
  stateName: STATE_NAME,
  runState: doTheThing,
  parameters: fleetSetupStateParameters,
}

export default fleetAppState
