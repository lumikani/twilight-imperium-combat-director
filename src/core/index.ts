import fleetSetupState from './appStates/fleetSetupState'
import { baseStore, setAppState, Store } from './store/store'

const INITIAL_APP_STATE = fleetSetupState.stateName

export type AppStateParameters = string[]
export type AppStateParametersObject = any
export interface AppState {
  stateName: string
  runState: (
    store: Store,
    parameters: AppStateParametersObject
  ) => [Store, string]
  parameters: AppStateParameters
}

let store: Store

const appStates: Record<string, AppState> = {
  [fleetSetupState.stateName]: fleetSetupState,
}

const selectAppState = (store: Store) => store.appState

export default {
  beginCombat: () => {
    store = baseStore

    store = setAppState(store, INITIAL_APP_STATE)
    return selectAppState(store)
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

    store = setAppState(store, nextAppStateName)
    return selectAppState(store)
  },
}
