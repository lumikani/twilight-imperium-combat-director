import {
  assignHitsReceivedAttacker,
  assignHitsReceivedDefender,
  getAttackerFleetSize,
  getDefenderFleetSize,
  PlayerStore,
  Store,
} from '../store/store'
import { Combatant } from './combatState'
import { AppState, AppStateParameters } from '../'
import { CombatValue, HasSustainDamage } from './fleetSetupState'

const APP_STATE_NAME = 'ASSIGN_HITS_STATE'

const NEXT_APP_STATE_NAME = 'COMBAT_STATE'

export const ASSIGNED_HITS_DEFENDER = 'ASSIGNED_HITS_DEFENDER'
export const ASSIGNED_HITS_ATTACKER = 'ASSIGNED_HITS_ATTACKER'

type FleetIdentifier = number
type NumberOfAssignments = number

export interface HitsAssignment {
  fleetIdentifier: FleetIdentifier
  numberOfAssignments: NumberOfAssignments
  shouldUseSustainDamage?: boolean
}

interface AssignHitsAppStateParameters extends AppStateParameters {
  [ASSIGNED_HITS_DEFENDER]: HitsAssignment[]
  [ASSIGNED_HITS_ATTACKER]: HitsAssignment[]
}

const getHitsScored = (store: Store, combatant: Combatant) =>
  store[combatant].hitsScored

const doTheThing = (
  store: Store,
  parameters: AssignHitsAppStateParameters
): [Store, string] => {
  parameters[ASSIGNED_HITS_ATTACKER].forEach((hitsAssignment) => {
    store = assignHitsReceivedAttacker(store, hitsAssignment)
  })

  parameters[ASSIGNED_HITS_DEFENDER].forEach((hitsAssignment) => {
    store = assignHitsReceivedDefender(store, hitsAssignment)
  })

  const attackerFleetSize = getAttackerFleetSize(store)
  const defenderFleetSize = getDefenderFleetSize(store)

  if (attackerFleetSize === 0 || defenderFleetSize === 0) {
    return [store, '']
  }

  const attackerHitsScoredLeft = getHitsScored(store, 'attacker')
  const defenderHitsScoredLeft = getHitsScored(store, 'defender')

  // Not all hits scored have been assigned and both players still have fleets
  // left? Let's run this state again, can't move on before all hits scored
  // have been assigned.
  if (attackerHitsScoredLeft > 0 || defenderHitsScoredLeft > 0) {
    return [store, APP_STATE_NAME]
  }

  // There are fleets left but all hits scored have been assigned. This
  // state has done its thing and another round needs to happen.
  return [store, NEXT_APP_STATE_NAME]
}

type HitsScored = PlayerStore['hitsScored']
export type FleetWithSustainDamages = [number, number]

export interface FleetData {
  fleetIdentifier: number
  numberOfShips: number
  hasSustainDamage: HasSustainDamage
  combatValue: CombatValue
}

export interface AssignHitsInstructions {
  hitsToAssign: HitsScored
  potentialSustainDamages: FleetWithSustainDamages[]
  allFleets: FleetData[]
}

export interface AssignHitsStateEntryValues {
  attacker: AssignHitsInstructions
  defender: AssignHitsInstructions
}

const getSustainDamageFleetIdentifiersAndAmounts = (
  store: Store,
  combatant: Combatant
): FleetWithSustainDamages[] => {
  return store[combatant].fleets.reduce(
    (acc: FleetWithSustainDamages[], fleet, index) => {
      if (fleet.length > 0 && fleet[0].hasSustainDamage) {
        acc.push([index, fleet.length])
      }
      return acc
    },
    []
  )
}

const getFleetData = (store: Store, combatant: Combatant) => {
  return store[combatant].fleets.reduce((acc: FleetData[], fleet, index) => {
    acc.push({
      fleetIdentifier: index,
      combatValue: fleet[0].combatValue,
      numberOfShips: fleet.length,
      hasSustainDamage: fleet[0].hasSustainDamage,
    })
    return acc
  }, [])
}

const assignHitsAppState: AppState = {
  stateName: APP_STATE_NAME,
  runState: doTheThing,
  getStateEntryValues: (store: Store): AssignHitsStateEntryValues => ({
    attacker: {
      hitsToAssign: getHitsScored(store, 'defender'),
      potentialSustainDamages: getSustainDamageFleetIdentifiersAndAmounts(
        store,
        'attacker'
      ),
      allFleets: getFleetData(store, 'attacker'),
    },
    defender: {
      hitsToAssign: getHitsScored(store, 'attacker'),
      potentialSustainDamages: getSustainDamageFleetIdentifiersAndAmounts(
        store,
        'defender'
      ),
      allFleets: getFleetData(store, 'defender'),
    },
  }),
  parameters: [ASSIGNED_HITS_ATTACKER, ASSIGNED_HITS_DEFENDER],
}

export default assignHitsAppState
