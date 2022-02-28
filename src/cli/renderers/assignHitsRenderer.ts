import { AssignHitsInstructions } from '../../core/appStates/assignHitsState'
import { createList } from '../utils'
import { prompt } from 'inquirer'
import { Combatant } from '../../core/appStates/combatState'

const ACTIONS = ['Assign hits', 'Use Sustain Damage', 'Done']
const ACTION = 'ACTION'

export const renderAssignHits = async (
  combatant: Combatant,
  assignInstructions: AssignHitsInstructions
) => {
  let action

  console.log(`${combatant.toUpperCase()}! Time to assign hits to your ships!`)
  console.log('--------------------------------------------------------------')
  const numFleetsWithSustainDamage =
    assignInstructions.potentialSustainDamages.length
  if (numFleetsWithSustainDamage > 0) {
    const numShipsWithSustainDamage = assignInstructions.potentialSustainDamages.reduce(
      (acc: number, [_, numSustainDamages]) => {
        return acc + numSustainDamages
      },
      0
    )
    console.log(
      `You have ${numFleetsWithSustainDamage} fleets that have the Sustain Damage ability`
    )
    console.log(
      `and potentially up to ${numShipsWithSustainDamage} ships with the Sustain Damage ability.`
    )
  }

  while (action !== 'Done') {
    action = (
      await prompt([
        createList(ACTION, 'Please select an action :)', ACTIONS, 0),
      ])
    )[ACTION]

    console.log(`> Handle user action ${action}.`)
  }
}
