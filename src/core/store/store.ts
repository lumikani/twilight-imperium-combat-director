import produce, { Draft } from 'immer'
import { AppStateName } from '..'
import { HitsAssignment } from '../appStates/assignHitsState'
import { Fleet } from '../appStates/fleetSetupState'

export interface PlayerStore {
  fleets: Fleet[]
  hitsScored: number
}

export interface Store {
  appState: AppStateName
  attacker: PlayerStore
  defender: PlayerStore
}

export const baseStore: Store = Object.freeze({
  appState: 'FLEET_SETUP_STATE',
  attacker: {
    fleets: [],
    hitsScored: 0,
  },
  defender: {
    fleets: [],
    hitsScored: 0,
  },
})

export const setAppState = produce(
  (draft: Draft<Store>, newAppState: AppStateName) => {
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

export const setHitsScoredAttacker = produce(
  (draft: Draft<Store>, hits: number) => {
    draft.attacker.hitsScored = hits
  }
)

export const setHitsScoredDefender = produce(
  (draft: Draft<Store>, hits: number) => {
    draft.defender.hitsScored = hits
  }
)

export const assignHitsReceivedAttacker = produce(
  (draft: Draft<Store>, hitsAssignment: HitsAssignment) => {
    const { fleetIdentifier, numberOfAssignments } = hitsAssignment
    draft.attacker.fleets[fleetIdentifier].splice(0, numberOfAssignments)
    draft.defender.hitsScored = draft.defender.hitsScored - numberOfAssignments
  }
)

export const assignHitsReceivedDefender = produce(
  (draft: Draft<Store>, hitsAssignment: HitsAssignment) => {
    const {
      fleetIdentifier,
      numberOfAssignments,
      shouldUseSustainDamage,
    } = hitsAssignment
    if (!shouldUseSustainDamage) {
      draft.defender.fleets[fleetIdentifier].splice(0, numberOfAssignments)
    }
    draft.attacker.hitsScored = draft.attacker.hitsScored - numberOfAssignments
  }
)

export const getAttackerFleetSize = (store: Store) => {
  return store.attacker.fleets.reduce((acc, fleet) => acc + fleet.length, 0)
}

export const getDefenderFleetSize = (store: Store) => {
  return store.defender.fleets.reduce((acc, fleet) => acc + fleet.length, 0)
}
