import { produce } from 'immer'

export interface PlayerState {
  fleets: Fleet[]
}

export interface State {
  attacker: PlayerState
  defender: PlayerState
}

export interface Question {
  type: 'input'
  name: string
  message: string
}

export interface Context {
  getUserInput: (questions: Question[]) => Promise<any>
  produce: typeof produce
}
