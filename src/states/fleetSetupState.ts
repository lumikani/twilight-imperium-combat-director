import { Context, State } from '../types/appTypes'
import { createBooleanChoice, createQuestion } from '../utils'
import { addAttackerFleet } from '../stateManager/stateManager'
import { AppState } from '../types/appTypes'

const STATE_NAME = 'FLEET_SETUP_STATE'

const fleetCreationQuestions = [
  createQuestion('shipCombatValue', 'What is the combat value of the ships?'),
  createBooleanChoice(
    'shipsHaveSustainDamage',
    'Do the ships have Sustain Damage?',
    false
  ),
  createQuestion('shipsCapacity', 'How much capacity does each ship have?', 0),
  createQuestion('fleetSize', 'How many ships of this type do you have?'),
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

const doTheThing = async (
  context: Context,
  state: State
): Promise<[State, string]> => {
  const { getUserInput } = context

  const answers = await getUserInput(fleetCreationQuestions)

  const numShips = Number.parseInt(answers.fleetSize)
  const combat = Number.parseInt(answers.shipCombatValue)
  const shipsHaveSustainDamage = answers.shipsHaveSustainDamage
  const shipsCapacity = Number.parseInt(answers.shipsCapacity)
  const newFleet = range(numShips).map(() =>
    createShip(combat, shipsHaveSustainDamage, shipsCapacity)
  )

  const nextDataState = addAttackerFleet(state, newFleet)

  const { runAgain } = await getUserInput([
    createBooleanChoice('runAgain', 'Add another fleet?', false),
  ])
  const nextAppState = runAgain ? STATE_NAME : ''
  return [nextDataState, nextAppState]
}

const fleetAppState: AppState = {
  stateName: STATE_NAME,
  runState: doTheThing,
}

export default fleetAppState
