import { Context, State } from '../types/appTypes'
import { createQuestion, log } from '../utils'
import { addAttackerFleet } from '../stateManager/stateManager'

const fleetCreationQuestions = [
  createQuestion('shipCombatValue', 'What is the combat value of the ships?'),
  createQuestion('shipsHaveSustainDamage', 'Do the ships have Sustain Damage?'),
  createQuestion('shipsCapacity', 'How much capacity does each ship have?'),
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
): Promise<[State, boolean]> => {
  const { getUserInput } = context

  const answers = await getUserInput(fleetCreationQuestions)

  const numShips = Number.parseInt(answers.fleetSize)
  const combat = Number.parseInt(answers.shipCombatValue)
  const shipsHaveSustainDamage = ['y', 't'].includes(
    answers.shipsHaveSustainDamage[0]
  )
    ? true
    : false
  const shipsCapacity = Number.parseInt(answers.shipsCapacity)
  const newFleet = range(numShips).map(() =>
    createShip(combat, shipsHaveSustainDamage, shipsCapacity)
  )

  const nextState = addAttackerFleet(state, newFleet)
  log(nextState)
  return [nextState, false]
}

export default doTheThing
