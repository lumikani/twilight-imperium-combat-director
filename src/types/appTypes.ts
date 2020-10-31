interface PlayerState {
  fleets: Fleet[]
}

interface State {
  attacker: PlayerState
  defender: PlayerState
}

interface Question {
  type: 'input'
  name: string
  message: string
}

interface Context {
  getUserInput: (questions: Question[]) => Promise<any>
}
