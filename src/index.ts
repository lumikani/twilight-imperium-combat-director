import { produce } from 'immer'
import { prompt } from 'inquirer'
import { Context, Question, AppState } from './types/appTypes'

import { baseState } from './stateManager/stateManager'
import fleetSetupState from './states/fleetSetupState'

const states: Record<string, AppState> = {
  [fleetSetupState.stateName]: fleetSetupState,
}

const getUserInput = async (questions: Question[]) => await prompt(questions)

const main = async () => {
  const context: Context = {
    getUserInput,
    produce,
  }

  let nextAppStateName = fleetSetupState.stateName
  let state = baseState

  while (nextAppStateName !== '') {
    const appState = states[nextAppStateName]
    const appStateResult = await appState.runState(context, state)

    nextAppStateName = appStateResult[1]
    state = appStateResult[0]
  }
}

;(async () => {
  try {
    const text = await main()
    console.log(text)
  } catch (error) {
    console.error(error)
  }
})()
