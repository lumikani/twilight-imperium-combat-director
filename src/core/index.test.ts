import fleetAppState, {
  Capacity,
  CombatValue,
  FLEET_SETUP_ATTACKER,
  FLEET_SETUP_DEFENDER,
  HasSustainDamage,
} from './appStates/fleetSetupState'
import combatAppState, {
  COMBAT_ROLLS_ATTACKER,
  COMBAT_ROLLS_DEFENDER,
} from './appStates/combatState'
import core, { AppStateParameters } from './index'
import { createFleet } from './utils'
import assignHitsAppState, {
  ASSIGNED_HITS_ATTACKER,
  ASSIGNED_HITS_DEFENDER,
  HitsAssignment,
} from './appStates/assignHitsState'

const ATTACKER_SHIPS_QUANTITY = 5
const ATTACKER_SHIPS_COMBAT_VALUE = 7
const ATTACKER_SHIPS_HAS_SUSTAIN_DAMAGE = false
const ATTACKER_SHIPS_CAPACITY = 0

type ShipTuple = [number, CombatValue, HasSustainDamage, Capacity]

const ATTACKER_SHIP: ShipTuple = [
  ATTACKER_SHIPS_QUANTITY,
  ATTACKER_SHIPS_COMBAT_VALUE,
  ATTACKER_SHIPS_HAS_SUSTAIN_DAMAGE,
  ATTACKER_SHIPS_CAPACITY,
]

const DEFENDER_SHIPS_QUANTITY = 3
const DEFENDER_SHIPS_COMBAT_VALUE = 3
const DEFENDER_SHIPS_HAS_SUSTAIN_DAMAGE = true
const DEFENDER_SHIPS_CAPACITY = 0

const DEFENDER_SHIP: ShipTuple = [
  DEFENDER_SHIPS_QUANTITY,
  DEFENDER_SHIPS_COMBAT_VALUE,
  DEFENDER_SHIPS_HAS_SUSTAIN_DAMAGE,
  DEFENDER_SHIPS_CAPACITY,
]

const mockAttackerFleet = createFleet(...ATTACKER_SHIP)
const mockDefenderFleet = createFleet(...DEFENDER_SHIP)

interface AppStateIOData {
  receivedNextStateInitialData: any
  requestedParameters: AppStateParameters
  parameters: object
}

const VALID_STATES: Record<string, AppStateIOData> = {
  [fleetAppState.stateName]: {
    receivedNextStateInitialData: {},
    requestedParameters: [FLEET_SETUP_DEFENDER, FLEET_SETUP_ATTACKER],
    parameters: {
      [FLEET_SETUP_DEFENDER]: [mockDefenderFleet],
      [FLEET_SETUP_ATTACKER]: [mockAttackerFleet],
    },
  },
  [combatAppState.stateName]: {
    receivedNextStateInitialData: {
      attacker: [
        {
          numberOfRolls: ATTACKER_SHIPS_QUANTITY,
          difficulty: ATTACKER_SHIPS_COMBAT_VALUE,
        },
      ],
      defender: [
        {
          numberOfRolls: DEFENDER_SHIPS_QUANTITY,
          difficulty: DEFENDER_SHIPS_COMBAT_VALUE,
        },
      ],
    },
    requestedParameters: [COMBAT_ROLLS_ATTACKER, COMBAT_ROLLS_DEFENDER],
    parameters: {
      [COMBAT_ROLLS_ATTACKER]: 3,
      [COMBAT_ROLLS_DEFENDER]: 2,
    },
  },
  [assignHitsAppState.stateName]: {
    receivedNextStateInitialData: {
      attacker: {
        hitsToAssign: 2,
        potentialSustainDamages: [],
        allFleets: [
          {
            combatValue: ATTACKER_SHIPS_COMBAT_VALUE,
            fleetIdentifier: 0,
            hasSustainDamage: ATTACKER_SHIPS_HAS_SUSTAIN_DAMAGE,
            numberOfShips: ATTACKER_SHIPS_QUANTITY,
          },
        ],
      },
      defender: {
        hitsToAssign: 3,
        potentialSustainDamages: [[0, 3]],
        allFleets: [
          {
            combatValue: DEFENDER_SHIPS_COMBAT_VALUE,
            fleetIdentifier: 0,
            hasSustainDamage: DEFENDER_SHIPS_HAS_SUSTAIN_DAMAGE,
            numberOfShips: DEFENDER_SHIPS_QUANTITY,
          },
        ],
      },
    },
    requestedParameters: [ASSIGNED_HITS_ATTACKER, ASSIGNED_HITS_DEFENDER],
    parameters: {
      [ASSIGNED_HITS_ATTACKER]: [
        { fleetIdentifier: 0, numberOfAssignments: 2 },
      ],
      [ASSIGNED_HITS_DEFENDER]: [
        { fleetIdentifier: 0, numberOfAssignments: 3 },
      ],
    },
  },
}

const moveToState = (stateName: string, returnAtStateEnd: boolean) => {
  core.initialize()
  let state
  for (const key of Object.keys(VALID_STATES)) {
    if (key === stateName && !returnAtStateEnd) {
      return state
    }

    const stateData = VALID_STATES[key]
    state = core.moveToNextStep(stateData.parameters)

    if (key === stateName && returnAtStateEnd) {
      return state
    }
  }
}

describe('Core logic tests', () => {
  afterEach(() => {
    core.reset()
  })

  test('should throw an error if beginCombat is not called first', () => {
    expect(() =>
      core.moveToNextStep({
        [FLEET_SETUP_DEFENDER]: [mockDefenderFleet],
        [FLEET_SETUP_ATTACKER]: [mockAttackerFleet],
      })
    ).toThrowError()
  })

  test('should run combat with valid inputs', () => {
    let [nextStateInitialData, nextStateParameters] = core.initialize()
    const fleetSetupStateData = VALID_STATES[fleetAppState.stateName]
    expect(nextStateParameters).toEqual(fleetSetupStateData.requestedParameters)

    let nextState = core.moveToNextStep(fleetSetupStateData.parameters)!

    const combatStateData = VALID_STATES[combatAppState.stateName]

    nextStateInitialData = nextState[0]
    expect(nextStateInitialData).toEqual(
      combatStateData.receivedNextStateInitialData
    )

    nextStateParameters = nextState[1]
    expect(nextStateParameters).toEqual(combatStateData.requestedParameters)

    nextState = core.moveToNextStep(combatStateData.parameters)!

    const assignHitsStateData = VALID_STATES[assignHitsAppState.stateName]

    nextStateInitialData = nextState[0]

    expect(nextStateInitialData).toEqual(
      assignHitsStateData.receivedNextStateInitialData
    )

    nextStateParameters = nextState[1]

    expect(nextStateParameters).toEqual(assignHitsStateData.requestedParameters)

    const finalState: null = (core.moveToNextStep(
      assignHitsStateData.parameters
    )! as unknown) as null

    expect(finalState).toBeNull()
  })

  test('should repeat assign hits state if all hits are not assigned', () => {
    moveToState(assignHitsAppState.stateName, false)

    const parameters = {
      [ASSIGNED_HITS_ATTACKER]: [
        { fleetIdentifier: 0, numberOfAssignments: 2 },
      ],
      [ASSIGNED_HITS_DEFENDER]: [
        { fleetIdentifier: 0, numberOfAssignments: 2 },
      ],
    }

    const nextState = core.moveToNextStep(parameters)!

    const expectedNextStateInitialData = {
      attacker: {
        hitsToAssign: 0,
        potentialSustainDamages: [],
        allFleets: [
          {
            combatValue: ATTACKER_SHIPS_COMBAT_VALUE,
            fleetIdentifier: 0,
            hasSustainDamage: ATTACKER_SHIPS_HAS_SUSTAIN_DAMAGE,
            numberOfShips: 3,
          },
        ],
      },
      defender: {
        hitsToAssign: 1,
        potentialSustainDamages: [[0, 1]],
        allFleets: [
          {
            combatValue: DEFENDER_SHIPS_COMBAT_VALUE,
            fleetIdentifier: 0,
            hasSustainDamage: DEFENDER_SHIPS_HAS_SUSTAIN_DAMAGE,
            numberOfShips: 1,
          },
        ],
      },
    }

    expect(nextState[0]).toEqual(expectedNextStateInitialData)

    const finalState: null = (core.moveToNextStep({
      [ASSIGNED_HITS_ATTACKER]: [
        { fleetIdentifier: 0, numberOfAssignments: 0 },
      ],
      [ASSIGNED_HITS_DEFENDER]: [
        { fleetIdentifier: 0, numberOfAssignments: 1 },
      ],
    })! as unknown) as null

    expect(finalState).toBeNull()
  })

  test('should go back to combat state if either fleet has ships remaining', () => {
    moveToState(combatAppState.stateName, false)

    const attackerHitsScored = 1
    const defenderHitsScored = 1

    const combatStateParametersFirst = {
      [COMBAT_ROLLS_ATTACKER]: attackerHitsScored,
      [COMBAT_ROLLS_DEFENDER]: defenderHitsScored,
    }

    let nextState = core.moveToNextStep(combatStateParametersFirst)!

    const expectedNextStateInitialData = {
      attacker: {
        hitsToAssign: defenderHitsScored,
        potentialSustainDamages: [],
        allFleets: [
          {
            combatValue: ATTACKER_SHIPS_COMBAT_VALUE,
            fleetIdentifier: 0,
            hasSustainDamage: ATTACKER_SHIPS_HAS_SUSTAIN_DAMAGE,
            numberOfShips: 5,
          },
        ],
      },
      defender: {
        hitsToAssign: attackerHitsScored,
        potentialSustainDamages: [[0, 3]],
        allFleets: [
          {
            combatValue: DEFENDER_SHIPS_COMBAT_VALUE,
            fleetIdentifier: 0,
            hasSustainDamage: DEFENDER_SHIPS_HAS_SUSTAIN_DAMAGE,
            numberOfShips: 3,
          },
        ],
      },
    }

    expect(nextState[0]).toEqual(expectedNextStateInitialData)!

    const assignHitsStateParametersFirst = {
      [ASSIGNED_HITS_ATTACKER]: [
        { fleetIdentifier: 0, numberOfAssignments: defenderHitsScored },
      ],
      [ASSIGNED_HITS_DEFENDER]: [
        { fleetIdentifier: 0, numberOfAssignments: attackerHitsScored },
      ],
    }

    nextState = core.moveToNextStep(assignHitsStateParametersFirst)!

    const expectedInitialData = {
      attacker: [
        {
          numberOfRolls: ATTACKER_SHIPS_QUANTITY - defenderHitsScored,
          difficulty: ATTACKER_SHIPS_COMBAT_VALUE,
        },
      ],
      defender: [
        {
          numberOfRolls: DEFENDER_SHIPS_QUANTITY - attackerHitsScored,
          difficulty: DEFENDER_SHIPS_COMBAT_VALUE,
        },
      ],
    }
    expect(nextState[0]).toEqual(expectedInitialData)
  })

  test('should go back to combat state with fleet that used sustained damage not destroyed', () => {
    moveToState(assignHitsAppState.stateName, false)

    const parameters: Record<string, HitsAssignment[]> = {
      [ASSIGNED_HITS_ATTACKER]: [
        { fleetIdentifier: 0, numberOfAssignments: 2 },
      ],
      [ASSIGNED_HITS_DEFENDER]: [
        {
          fleetIdentifier: 0,
          numberOfAssignments: 3,
          shouldUseSustainDamage: true,
        },
      ],
    }

    const nextState = core.moveToNextStep(parameters)!
    const {
      receivedNextStateInitialData: { defender },
    } = VALID_STATES[combatAppState.stateName]

    const expectedInitialData = {
      attacker: [
        {
          difficulty: 7,
          numberOfRolls: 3,
        },
      ],
      defender,
    }

    expect(nextState[0]).toEqual(expectedInitialData)
  })
})
