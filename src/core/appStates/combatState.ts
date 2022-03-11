import {
  Store,
  setHitsScoredAttacker,
  setHitsScoredDefender,
} from '../store/store'
import { AppStateInterface } from '..'
import assignHitsAppState from './assignHitsState'

const APP_STATE_NAME = 'COMBAT_STATE'
const NEXT_APP_STATE_NAME = assignHitsAppState.stateName

export const COMBAT_ROLLS_ATTACKER = 'COMBAT_ROLLS_ATTACKER'
export const COMBAT_ROLLS_DEFENDER = 'COMBAT_ROLLS_DEFENDER'

export interface CombatAppStateParameters {
  [COMBAT_ROLLS_DEFENDER]: number
  [COMBAT_ROLLS_ATTACKER]: number
}

const doTheThing = (
  store: Store,
  parameters: CombatAppStateParameters
): [Store, string] => {
  const attackerHits = parameters[COMBAT_ROLLS_ATTACKER]
  let nextStore = setHitsScoredAttacker(store, attackerHits)
  const defenderHits = parameters[COMBAT_ROLLS_DEFENDER]
  nextStore = setHitsScoredDefender(nextStore, defenderHits)

  return [nextStore, NEXT_APP_STATE_NAME]
}

export interface RollInstruction {
  difficulty: number
  numberOfRolls: number
}

export type Combatant = 'attacker' | 'defender'

const getRollInstructions = (
  store: Store,
  combatant: Combatant
): RollInstruction[] => {
  const fleets = store[combatant].fleets

  const rollInstructions: RollInstruction[] = fleets.map((fleet) => ({
    numberOfRolls: fleet.length,
    difficulty: fleet[0].combatValue,
  }))

  return rollInstructions
}

export interface CombatAppStateEntryValues {
  attacker: RollInstruction[]
  defender: RollInstruction[]
}

const combatAppState: AppStateInterface<
  CombatAppStateParameters,
  CombatAppStateEntryValues
> = {
  stateName: APP_STATE_NAME,
  runState: doTheThing,
  getStateEntryValues: (store: Store): CombatAppStateEntryValues => ({
    attacker: getRollInstructions(store, 'attacker'),
    defender: getRollInstructions(store, 'defender'),
  }),
  parameters: [COMBAT_ROLLS_ATTACKER, COMBAT_ROLLS_DEFENDER],
}

export default combatAppState
