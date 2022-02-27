import assignHitsState from './appStates/assignHitsState'
import combatAppState from './appStates/combatState'
import fleetAppSetupState from './appStates/fleetSetupState'
import { baseStore, setAppState, Store } from './store/store'

// Handy for debugging values in the store etc
// export const log = (data: any) => {
//   console.log(JSON.stringify(data, null, 2))
// }

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
  [assignHitsState.stateName]: assignHitsState,
}

const selectAppState = (store: Store) => store.appState

export default {
  reset: () => {
    store = baseStore
  },
  initialize: (): [any, AppStateParameters] => {
    store = baseStore

    store = setAppState(store, INITIAL_APP_STATE)
    const nextAppState = appStates[selectAppState(store)!]
    return [nextAppState.getStateEntryValues(store), nextAppState.parameters]
  },
  moveToNextStep: (
    appStateParameters: AppStateParametersObject
  ): [object, AppStateParameters] | null => {
    if (!store || store.appState === null) {
      throw Error('Combat not initialized: call beginCombat() first!')
    }

    // Run the logic for the next state, giving the current store and
    // parameters required by the state as inputs. Running the state logic will
    // return the name of the next state.
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
    // Return the entry values/parameters expected by the next state, so that
    // the renderer can gather those values and then provide them for the next
    // state.
    return [nextAppState.getStateEntryValues(store), nextAppState.parameters]
  },
}
