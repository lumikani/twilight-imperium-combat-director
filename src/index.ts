import { produce } from 'immer'
import { prompt } from 'inquirer'
import { Context, State, Question } from './types/appTypes'

import { baseState } from './stateManager/stateManager'
import fleetSetupState from './states/fleetSetupState'

type AppState = (context: Context, state: State) => Promise<[State, boolean]>

const states: AppState[] = [fleetSetupState]

const getUserInput = async (questions: Question[]) => await prompt(questions)

const context: Context = {
  getUserInput,
  produce,
}

let shouldRepeat = true
let state = baseState
states.forEach(async (item) => {
  while (shouldRepeat) {
    let stepResult = await item(context, state)
    shouldRepeat = stepResult[1]
    state = stepResult[0]
  }
})
