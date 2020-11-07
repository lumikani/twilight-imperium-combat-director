import combatAppState from './appStates/combatState'
import fleetAppSetupState from './appStates/fleetSetupState'
import { baseStore, setAppState, Store } from './store/store'

export const log = (data: any) => {
  console.log(JSON.stringify(data, null, 2))
}

const INITIAL_APP_STATE = fleetAppSetupState.stateName

export type AppStateParameters = string[]
export type AppStateParametersObject = any
export interface AppState {
  stateName: string
  runState: (
    store: Store,
    parameters: AppStateParametersObject
  ) => [Store, string]
  parameters: string[]
  getStateEntryValues: (store: Store) => any
}

let store: Store

const appStates: Record<string, AppState> = {
  [fleetAppSetupState.stateName]: fleetAppSetupState,
  [combatAppState.stateName]: combatAppState,
}

const selectAppState = (store: Store) => store.appState

export default {
  beginCombat: () => {
    store = baseStore

    store = setAppState(store, INITIAL_APP_STATE)
    return appStates[selectAppState(store)!].parameters
  },
  moveToNextStep: (appStateParameters: AppStateParametersObject) => {
    if (store.appState === null) {
      throw Error('Combat not initialized: call beginCombat() first!')
    }

    const [newStore, nextAppStateName] = appStates[store.appState].runState(
      store,
      appStateParameters
    )
    store = newStore

    if (nextAppStateName === '') {
      return null
    }

    store = setAppState(store, nextAppStateName)
    const nextAppState = appStates[selectAppState(store)!]
    return [nextAppState.getStateEntryValues(store), nextAppState.parameters]
  },
}
