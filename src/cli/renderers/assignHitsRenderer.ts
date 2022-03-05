import {
  AssignHitsInstructions,
  FleetData,
  FleetWithSustainDamages,
  HitsAssignment,
} from '../../core/appStates/assignHitsState'
import {
  createList,
  createQuestion,
  QuestionObject,
  renderText,
} from '../utils'
import { prompt } from 'inquirer'
import { Combatant } from '../../core/appStates/combatState'

enum PLAYER_ACTION {
  AssignHits = 'Assign hits',
  UseSustainDamage = 'Use Sustain Damage',
  Done = 'Done',
}

const ACTIONS = [
  PLAYER_ACTION.AssignHits,
  PLAYER_ACTION.UseSustainDamage,
  PLAYER_ACTION.Done,
]
const ACTION = 'ACTION'

const renderSustainDamagePSA = (
  potentialSustainDamages: FleetWithSustainDamages[]
) => {
  const numFleetsWithSustainDamage = potentialSustainDamages.length
  if (numFleetsWithSustainDamage > 0) {
    const numShipsWithSustainDamage = potentialSustainDamages.reduce(
      (acc: number, [_, numSustainDamages]) => {
        return acc + numSustainDamages
      },
      0
    )
    renderText(
      `You have ${numFleetsWithSustainDamage} fleets that have the Sustain Damage ability`
    )
    renderText(
      `and potentially up to ${numShipsWithSustainDamage} ships with the Sustain Damage ability.`
    )
  }
}

const createAssignHitsActions = (allFleets: FleetData[]) => {
  return allFleets
    .filter((fleet) => fleet.numberOfShips !== 0)
    .map<QuestionObject>(
      ({ fleetIdentifier, combatValue, hasSustainDamage, numberOfShips }) => ({
        name: `${
          fleetIdentifier + 1
        }) Combat: ${combatValue} / Sustain Damage: ${
          hasSustainDamage ? 'Y' : 'N'
        } / Quantity: ${numberOfShips}`,
        value: fleetIdentifier,
      })
    )
}

const NUMBER_OF_HIT_ASSIGNMENTS = 'NUMBER_OF_HIT_ASSIGNMENTS'
const handleAssignHits = async ({
  allFleets,
}: AssignHitsInstructions): Promise<HitsAssignment> => {
  const fleetIdentifier = (
    await prompt([
      createList(
        ACTION,
        'Which fleet to assign hits to?',
        createAssignHitsActions(allFleets),
        0
      ),
    ])
  )[ACTION]

  const questionMsg = `How many hits do you want to assign to fleet #${fleetIdentifier}?`
  const answer = await prompt([
    createQuestion(NUMBER_OF_HIT_ASSIGNMENTS, questionMsg, 0),
  ])
  const numberOfAssignments = Number.parseInt(answer[NUMBER_OF_HIT_ASSIGNMENTS])

  return {
    fleetIdentifier,
    numberOfAssignments,
    shouldUseSustainDamage: false,
  }
}

const handleSustainDamage = async ({
  allFleets,
}: AssignHitsInstructions): Promise<HitsAssignment> => {
  const fleetsWithSustain = allFleets.filter((fleet) => fleet.hasSustainDamage)
  const fleetIdentifier = (
    await prompt([
      createList(
        ACTION,
        'Which fleet to sustain hits with?',
        createAssignHitsActions(fleetsWithSustain),
        0
      ),
    ])
  )[ACTION]

  const questionMsg = `How many hits do you want to sustain with fleet #${fleetIdentifier}?`
  const answer = await prompt([
    createQuestion(NUMBER_OF_HIT_ASSIGNMENTS, questionMsg, 0),
  ])
  const numberOfAssignments = Number.parseInt(answer[NUMBER_OF_HIT_ASSIGNMENTS])

  return {
    fleetIdentifier,
    numberOfAssignments,
    shouldUseSustainDamage: true,
  }
}

const handleAction = async (
  action: PLAYER_ACTION,
  assignHitsInstructions: AssignHitsInstructions,
  hitsAssignments: HitsAssignment[]
) => {
  const hitsAssigned = hitsAssignments.reduce(
    (acc, { numberOfAssignments }) => acc + numberOfAssignments,
    0
  )
  renderText(
    `You still have ${
      assignHitsInstructions.hitsToAssign - hitsAssigned
    } hits left to assign.`
  )

  let newAssignment: HitsAssignment
  switch (action) {
    case PLAYER_ACTION.AssignHits:
      newAssignment = await handleAssignHits(assignHitsInstructions)
      hitsAssignments.push(newAssignment)
      break
    case PLAYER_ACTION.UseSustainDamage:
      newAssignment = await handleSustainDamage(assignHitsInstructions)
      hitsAssignments.push(newAssignment)
      break
    default:
      break
  }

  return hitsAssignments
}

export const renderAssignHits = async (
  combatant: Combatant,
  assignHitsInstructions: AssignHitsInstructions
) => {
  let action

  const { potentialSustainDamages } = assignHitsInstructions
  let hitsAssignments: HitsAssignment[] = []
  console.log(`${combatant.toUpperCase()}! Time to assign hits to your ships!`)
  console.log('--------------------------------------------------------------')
  renderSustainDamagePSA(potentialSustainDamages)
  while (action !== PLAYER_ACTION.Done) {
    action = (
      await prompt([
        createList(ACTION, 'Please select an action :)', ACTIONS, 0),
      ])
    )[ACTION]

    hitsAssignments = await handleAction(
      action,
      assignHitsInstructions,
      hitsAssignments
    )

    const hitsAssigned = hitsAssignments.reduce(
      (acc, { numberOfAssignments }) => acc + numberOfAssignments,
      0
    )
    renderText(
      `${hitsAssigned} hits assigned out of ${
        assignHitsInstructions.hitsToAssign
      } (${assignHitsInstructions.hitsToAssign - hitsAssigned} remaining)`
    )
  }

  return hitsAssignments
}
