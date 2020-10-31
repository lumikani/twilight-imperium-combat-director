interface PlayerState {
  fleets: Fleet[]
}

interface State {
  attacker: PlayerState
  defender: PlayerState
}
