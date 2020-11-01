import { produce } from 'immer'

export type PromptType = 'input' | 'confirm'
export type DefaultValueType = string | number | boolean

export interface AppState {
  stateName: string
  runState: (context: Context, state: State) => Promise<[State, string]>
}

export interface PlayerState {
  fleets: Fleet[]
}

export interface State {
  attacker: PlayerState
  defender: PlayerState
}

export interface Question {
  type: PromptType
  name: string
  message: string
  default?: DefaultValueType
}

export interface Context {
  getUserInput: (questions: Question[]) => Promise<any>
  produce: typeof produce
}
