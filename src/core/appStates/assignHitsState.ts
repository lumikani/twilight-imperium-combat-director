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

const APP_STATE_NAME = 'ASSIGN_HITS_STATE'

const NEXT_APP_STATE_NAME = 'COMBAT_STATE'

export const ASSIGNED_HITS_DEFENDER = 'ASSIGNED_HITS_DEFENDER'
export const ASSIGNED_HITS_ATTACKER = 'ASSIGNED_HITS_ATTACKER'

type FleetIdentifier = number
type NumberOfAssignments = number

export interface HitsAssignment {
  fleetIdentifier: FleetIdentifier
  numberOfAssignments: NumberOfAssignments
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

export interface AssignHitsStateEntryValues {
  attacker: HitsScored
  defender: HitsScored
}

const assignHitsAppState: AppState = {
  stateName: APP_STATE_NAME,
  runState: doTheThing,
  getStateEntryValues: (store: Store): AssignHitsStateEntryValues => ({
    attacker: getHitsScored(store, 'attacker'),
    defender: getHitsScored(store, 'defender'),
  }),
  parameters: [ASSIGNED_HITS_ATTACKER, ASSIGNED_HITS_DEFENDER],
}

export default assignHitsAppState
