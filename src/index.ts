import { prompt } from 'inquirer'

const state: State = {
  attacker: {
    fleets: [],
  },
  defender: {
    fleets: [],
  },
}

const log = (data: any) => {
  console.log(JSON.stringify(data, null, 2))
}

const createQuestion = (name: string, question: string) => ({
  type: 'input',
  name,
  message: question,
})

const fleetCreationQuestions = [
  createQuestion('shipCombatValue', 'What is the combat value of the ships?'),
  createQuestion('shipsHaveSustainDamage', 'Do the ships have Sustain Damage?'),
  createQuestion('shipsCapacity', 'How much capacity does each ship have?'),
  createQuestion('fleetSize', 'How many ships of this type do you have?'),
]

const createShip = (
  combat: Combat,
  hasSustainDamage: HasSustainDamage,
  capacity: Capacity
): Ship => ({
  combat,
  hasSustainDamage,
  capacity,
})

const range = (end: number) => {
  return Array.from({ length: end }, (_, i) => i)
}

prompt(fleetCreationQuestions).then((answers) => {
  const numShips = Number.parseInt(answers.fleetSize)
  const combat = Number.parseInt(answers.shipCombatValue)
  const shipsHaveSustainDamage = ['y', 't'].includes(
    answers.shipsHaveSustainDamage[0]
  )
    ? true
    : false
  const shipsCapacity = Number.parseInt(answers.shipsCapacity)
  const newFleet = range(numShips).map(() =>
    createShip(combat, shipsHaveSustainDamage, shipsCapacity)
  )
  state.attacker.fleets = [...state.attacker.fleets, newFleet]
  log(state)
})
