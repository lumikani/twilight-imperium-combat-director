import produce, { Draft } from 'immer'
import { Fleet } from '../appStates/fleetSetupState'

export interface PlayerStore {
  fleets: Fleet[]
  hits: number
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
    hits: 0,
  },
  defender: {
    fleets: [],
    hits: 0,
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

export const setAttackerHits = produce((draft: Draft<Store>, hits: number) => {
  draft.attacker.hits = hits
})

export const setDefenderHits = produce((draft: Draft<Store>, hits: number) => {
  draft.defender.hits = hits
})
