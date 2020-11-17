import { Combatant, RollInstruction } from '../../core/appStates/combatState'
import { createQuestion } from '../utils'
import { prompt } from 'inquirer'

const COMBAT_ROLL = 'COMBAT_ROLL'

export const renderCombatRolling = async (
  combatant: Combatant,
  rollInstructions: RollInstruction[]
) => {
  let numberOfHits = 0
  for (const rollInstruction of rollInstructions) {
    const { difficulty, numberOfRolls } = rollInstruction
    const questionMsg = `${combatant.toUpperCase()}! Roll ${numberOfRolls} dice. How many had a result ≥${difficulty}?`
    const answer = await prompt([createQuestion(COMBAT_ROLL, questionMsg, 0)])
    numberOfHits = numberOfHits + Number.parseInt(answer[COMBAT_ROLL])
  }

  return numberOfHits
}
