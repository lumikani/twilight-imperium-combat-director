import assignHitsState, {
  APP_STATE_NAME as ASSIGN_HITS_STATE_NAME,
  AssignHitsAppStateEntryValues,
  AssignHitsAppStateParameters,
} from './appStates/assignHitsState'
import combatAppState, {
  APP_STATE_NAME as COMBAT_STATE_NAME,
  CombatAppStateEntryValues,
  CombatAppStateParameters,
} from './appStates/combatState'
import fleetAppSetupState, {
  APP_STATE_NAME as FLEET_SETUP_STATE_NAME,
  FleetSetupAppStateEntryValues,
  FleetSetupAppStateParameters,
} from './appStates/fleetSetupState'
import { baseStore, setAppState, Store } from './store/store'

// Handy for debugging values in the store etc
// export const log = (data: any) => {
//   console.log(JSON.stringify(data, null, 2))
// }

const INITIAL_APP_STATE = FLEET_SETUP_STATE_NAME

export type AppStateParametersObject = any
export type AppStateName =
  | typeof FLEET_SETUP_STATE_NAME
  | typeof COMBAT_STATE_NAME
  | typeof ASSIGN_HITS_STATE_NAME

export interface AppStateParameters {}

export type FleetSetupState = AppStateInterface<
  FleetSetupAppStateParameters,
  FleetSetupAppStateEntryValues
>

export type CombatState = AppStateInterface<
  CombatAppStateParameters,
  CombatAppStateEntryValues
>

export type AssignHitsState = AppStateInterface<
  AssignHitsAppStateParameters,
  AssignHitsAppStateEntryValues
>

export type AppState = FleetSetupState | CombatState | AssignHitsState
export interface AppStateInterface<T, K> {
  stateName: AppStateName
  runState: (store: Store, parameters: T) => [Store, AppStateName]
  parameters: Array<keyof T>
  getStateEntryValues: (store: Store) => K
}

let store: Store

const appStates: Record<AppStateName, AppState> = {
  [FLEET_SETUP_STATE_NAME]: fleetAppSetupState,
  [COMBAT_STATE_NAME]: combatAppState,
  [ASSIGN_HITS_STATE_NAME]: assignHitsState,
}

const selectAppState = (store: Store) => store.appState

//interface AppCore {
//  reset: () => void
//  initialize:
//}

const core = {
  reset: () => {
    store = baseStore
  },
  initialize: () => {
    store = baseStore

    store = setAppState(store, INITIAL_APP_STATE)
    const nextAppState = appStates[selectAppState(store)]
    return [nextAppState.getStateEntryValues(store), nextAppState.parameters]
  },
  moveToNextStep: <T extends AppStateParameters>(appStateParameters: T) => {
    if (!store || store.appState === null) {
      throw Error('Combat not initialized: call beginCombat() first!')
    }

    // Run the logic for the next state, giving the current store and
    // parameters required by the state as inputs. Running the state logic will
    // return the name of the next state.
    const nextState = appStates[store.appState]
    const [newStore, nextAppStateName] = nextState.runState(
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

export default core
