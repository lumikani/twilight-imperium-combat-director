import { createBooleanChoice, createQuestion } from '../utils'
import { prompt } from 'inquirer'
import core from '../core'
import {
  ADD_ANOTHER_FLEET,
  SHIPS_QUANTITY,
  SHIPS_COMBAT_VALUE,
  SHIPS_CAPACITY,
  SHIPS_HAVE_SUSTAIN_DAMAGE,
  STATE_NAME,
} from '../core/appStates/fleetSetupState'
import { AppStateParametersObject } from '../core/'

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

const renderFleetSetup = async () => {
  const answers = await prompt(fleetCreationQuestionsMap)

  const addAnotherFleetAnswer = (
    await prompt([
      createBooleanChoice(ADD_ANOTHER_FLEET, 'Add another fleet?', false),
    ])
  )[ADD_ANOTHER_FLEET]

  return {
    [SHIPS_QUANTITY]: Number.parseInt(answers[SHIPS_QUANTITY]),
    [SHIPS_COMBAT_VALUE]: Number.parseInt(answers[SHIPS_COMBAT_VALUE]),
    [SHIPS_HAVE_SUSTAIN_DAMAGE]: answers[SHIPS_HAVE_SUSTAIN_DAMAGE],
    [SHIPS_CAPACITY]: Number.parseInt(SHIPS_CAPACITY),
    [ADD_ANOTHER_FLEET]: addAnotherFleetAnswer,
  }
}

const appStateRenderers: Record<string, Function> = {
  [STATE_NAME]: renderFleetSetup,
}

const main = async () => {
  let nextStateName = core.beginCombat()

  while (nextStateName !== '') {
    const nextStateParameters: AppStateParametersObject = await appStateRenderers[
      nextStateName!
    ]()
    nextStateName = core.moveToNextStep(nextStateParameters)
  }
}

export default async () => {
  try {
    const text = await main()
    console.log(text)
  } catch (error) {
    console.error(error)
  }
}
