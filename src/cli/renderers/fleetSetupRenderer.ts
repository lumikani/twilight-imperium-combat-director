import { createBooleanChoice, createQuestion } from '../utils'
import { prompt } from 'inquirer'
import { Fleet } from '../../core/appStates/fleetSetupState'

import { createFleet } from '../../core/utils'

export const STATE_NAME = 'FLEET_SETUP_STATE'
export const SHIPS_QUANTITY = 'SHIPS_QUANTITY'
export const SHIPS_COMBAT_VALUE = 'SHIPS_COMBAT_VALUE'
export const SHIPS_HAVE_SUSTAIN_DAMAGE = 'SHIPS_HAVE_SUSTAIN_DAMAGE'
export const SHIPS_CAPACITY = 'SHIPS_CAPACITY'

export const ADD_ANOTHER_FLEET = 'ADD_ANOTHER_FLEET'

const fleetCreationQuestionsMap = [
  createQuestion(SHIPS_COMBAT_VALUE, 'What is the combat value of the ships?'),
  createBooleanChoice(
    SHIPS_HAVE_SUSTAIN_DAMAGE,
    'Do the ships have Sustain Damage?',
    false
  ),
  createQuestion(SHIPS_CAPACITY, 'How much capacity does each ship have?', 0),
  createQuestion(SHIPS_QUANTITY, 'How many ships of this type do you have?'),
]

export const renderFleetSetup = async (combatant: string) => {
  console.log(`Begin fleet creation for ${combatant}!`)
  let shouldAddFleet = true
  let fleets: Fleet[] = []

  while (shouldAddFleet) {
    const answers = await prompt(fleetCreationQuestionsMap)
    const shipsQuantity = Number.parseInt(answers[SHIPS_QUANTITY])
    const shipsCombatValue = Number.parseInt(answers[SHIPS_COMBAT_VALUE])
    const shipsHaveSustainDamage = answers[SHIPS_HAVE_SUSTAIN_DAMAGE]
    const shipsCapacity = Number.parseInt(answers[SHIPS_CAPACITY])

    const newFleet = createFleet(
      shipsQuantity,
      shipsCombatValue,
      shipsHaveSustainDamage,
      shipsCapacity
    )
    fleets.push(newFleet)

    const addAnotherFleetAnswer = (
      await prompt([
        createBooleanChoice(ADD_ANOTHER_FLEET, 'Add another fleet?', false),
      ])
    )[ADD_ANOTHER_FLEET]
    shouldAddFleet = addAnotherFleetAnswer
  }

  return fleets
}
