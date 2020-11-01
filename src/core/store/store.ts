import produce, { Draft } from 'immer'

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

export const addAttackerFleet = produce((draft: Draft<Store>, fleet: Fleet) => {
  draft.attacker.fleets.push(fleet)
})
