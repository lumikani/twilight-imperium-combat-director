import { prompt } from 'inquirer'
import { baseState } from './stateManager/stateManager'
import { doTheThing } from './states/fleetSetupState'

const getUserInput = async (questions: Question[]) => await prompt(questions)

const context: Context = {
  getUserInput,
}

doTheThing(context, baseState)
