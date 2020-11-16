import {
  Capacity,
  CombatValue,
  FLEET_SETUP_ATTACKER,
  FLEET_SETUP_DEFENDER,
  HasSustainDamage,
} from './appStates/fleetSetupState'
import {
  COMBAT_ROLLS_ATTACKER,
  COMBAT_ROLLS_DEFENDER,
} from './appStates/combatState'
import core from './index'
import { createFleet } from './utils'

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
const DEFENDER_SHIPS_HAS_SUSTAIN_DAMAGE = false
const DEFENDER_SHIPS_CAPACITY = 0

const DEFENDER_SHIP: ShipTuple = [
  DEFENDER_SHIPS_QUANTITY,
  DEFENDER_SHIPS_COMBAT_VALUE,
  DEFENDER_SHIPS_HAS_SUSTAIN_DAMAGE,
  DEFENDER_SHIPS_CAPACITY,
]

const mockAttackerFleet = createFleet(...ATTACKER_SHIP)
const mockDefenderFleet = createFleet(...DEFENDER_SHIP)

test('should do something', () => {
  let nextStateParameters = core.beginCombat()
  expect(nextStateParameters).toContain(FLEET_SETUP_DEFENDER)
  expect(nextStateParameters).toContain(FLEET_SETUP_ATTACKER)
  let nextStateInitialData: any = {}

  let nextState = core.moveToNextStep({
    [FLEET_SETUP_DEFENDER]: [mockDefenderFleet],
    [FLEET_SETUP_ATTACKER]: [mockAttackerFleet],
  })!

  nextStateInitialData = nextState[0]
  expect(nextStateInitialData).toHaveProperty('attacker')
  expect(nextStateInitialData).toHaveProperty('defender')

  expect(nextStateInitialData.attacker[0]).toEqual({
    numberOfRolls: ATTACKER_SHIPS_QUANTITY,
    difficulty: ATTACKER_SHIPS_COMBAT_VALUE,
  })

  expect(nextStateInitialData.defender[0]).toEqual({
    numberOfRolls: DEFENDER_SHIPS_QUANTITY,
    difficulty: DEFENDER_SHIPS_COMBAT_VALUE,
  })

  nextStateParameters = nextState[1]

  expect(nextStateParameters).toEqual([
    COMBAT_ROLLS_ATTACKER,
    COMBAT_ROLLS_DEFENDER,
  ])
})
