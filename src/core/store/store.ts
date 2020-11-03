import produce, { Draft } from 'immer'
import { Fleet } from '../appStates/fleetSetupState'

export interface PlayerStore {
  fleets: Fleet[]
}

export interface Store {
  appState: string | null
  attacker: PlayerStore
  defender: PlayerStore
}

export const baseStore: Store = Object.freeze({
  appState: null,
  attacker: {
    fleets: [],
  },
  defender: {
    fleets: [],
  },
})

export const setAppState = produce(
  (draft: Draft<Store>, newAppState: string) => {
    draft.appState = newAppState
  }
)

export const setAttackerFleets = produce(
  (draft: Draft<Store>, fleets: Fleet[]) => {
    draft.attacker.fleets = fleets
  }
)

export const setDefenderFleets = produce(
  (draft: Draft<Store>, fleets: Fleet[]) => {
    draft.defender.fleets = fleets
  }
)
