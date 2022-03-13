import { Store, setAttackerFleets, setDefenderFleets } from '../store/store'
import { AppStateInterface, AppStateName, AppStateParameters } from '..'
import combatAppState from './combatState'

export const APP_STATE_NAME = 'FLEET_SETUP_STATE'
const NEXT_APP_STATE_NAME = combatAppState.stateName

export type Fleet = Ship[]

export type CombatValue = number
export type HasSustainDamage = boolean
export type Capacity = number
export interface Ship {
  combatValue: CombatValue
  hasSustainDamage: HasSustainDamage
  capacity: Capacity
}

export const FLEET_SETUP_ATTACKER = 'FLEET_SETUP_ATTACKER'
export const FLEET_SETUP_DEFENDER = 'FLEET_SETUP_DEFENDER'

export interface FleetSetupAppStateParameters extends AppStateParameters {
  [FLEET_SETUP_DEFENDER]: Fleet[]
  [FLEET_SETUP_ATTACKER]: Fleet[]
}

const doTheThing = (
  store: Store,
  parameters: FleetSetupAppStateParameters
): [Store, AppStateName] => {
  const attackerFleets = parameters[FLEET_SETUP_ATTACKER]
  let nextStore = setAttackerFleets(store, attackerFleets)
  const defenderFleets = parameters[FLEET_SETUP_DEFENDER]
  nextStore = setDefenderFleets(nextStore, defenderFleets)

  return [nextStore, NEXT_APP_STATE_NAME]
}

export type FleetSetupAppStateEntryValues = {}

const fleetAppState: AppStateInterface<
  FleetSetupAppStateParameters,
  FleetSetupAppStateEntryValues
> = {
  stateName: APP_STATE_NAME,
  runState: doTheThing,
  parameters: [FLEET_SETUP_DEFENDER, FLEET_SETUP_ATTACKER],
  getStateEntryValues: () => ({}),
}

export default fleetAppState
