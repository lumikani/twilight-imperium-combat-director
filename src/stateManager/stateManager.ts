import produce, { Draft } from 'immer'
import { State } from '../types/appTypes'

export const baseState: State = Object.freeze({
  attacker: {
    fleets: [],
  },
  defender: {
    fleets: [],
  },
})

export const addAttackerFleet = produce((draft: Draft<State>, fleet: Fleet) => {
  draft.attacker.fleets.push(fleet)
})
