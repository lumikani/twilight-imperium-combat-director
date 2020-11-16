import { Store, setAttackerHits, setDefenderHits } from '../store/store'
import { AppState } from '..'

const APP_STATE_NAME = 'COMBAT_STATE'
const NEXT_APP_STATE_NAME = ''

export const COMBAT_ROLLS_ATTACKER = 'COMBAT_ROLLS_ATTACKER'
export const COMBAT_ROLLS_DEFENDER = 'COMBAT_ROLLS_DEFENDER'

type AppStateParameters = object
interface CombatAppStateParameters extends AppStateParameters {
  [COMBAT_ROLLS_DEFENDER]: number
  [COMBAT_ROLLS_ATTACKER]: number
}

const doTheThing = (
  store: Store,
  parameters: CombatAppStateParameters
): [Store, string] => {
  const attackerHits = parameters[COMBAT_ROLLS_ATTACKER]
  let nextStore = setAttackerHits(store, attackerHits)
  const defenderHits = parameters[COMBAT_ROLLS_DEFENDER]
  nextStore = setDefenderHits(nextStore, defenderHits)

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

export interface CombatStateEntryValues {
  attacker: RollInstruction[]
  defender: RollInstruction[]
}

const combatAppState: AppState = {
  stateName: APP_STATE_NAME,
  runState: doTheThing,
  getStateEntryValues: (store: Store): CombatStateEntryValues => ({
    attacker: getRollInstructions(store, 'attacker'),
    defender: getRollInstructions(store, 'defender'),
  }),
  parameters: [COMBAT_ROLLS_ATTACKER, COMBAT_ROLLS_DEFENDER],
}

export default combatAppState
