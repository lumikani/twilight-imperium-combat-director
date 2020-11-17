import core from '../core'
import {
  FLEET_SETUP_DEFENDER,
  FLEET_SETUP_ATTACKER,
} from '../core/appStates/fleetSetupState'
import { AppStateParameters, AppStateParametersObject } from '../core/'
import {
  createCombatStateRenderer,
  createFleetSetupRenderer,
} from './renderers'
import {
  COMBAT_ROLLS_ATTACKER,
  COMBAT_ROLLS_DEFENDER,
} from '../core/appStates/combatState'

const appStateRenderers: Record<string, Function> = {
  [FLEET_SETUP_DEFENDER]: createFleetSetupRenderer('defender'),
  [FLEET_SETUP_ATTACKER]: createFleetSetupRenderer('attacker'),
  [COMBAT_ROLLS_ATTACKER]: createCombatStateRenderer('attacker'),
  [COMBAT_ROLLS_DEFENDER]: createCombatStateRenderer('defender'),
}

const main = async () => {
  let nextStateParameters: AppStateParameters = core.beginCombat()
  let nextStateInitialData: any = {}

  while (nextStateParameters.length > 0) {
    const parameters: AppStateParametersObject = {}
    for (const nextStateParameter of nextStateParameters) {
      parameters[nextStateParameter] = await appStateRenderers[
        nextStateParameter
      ](nextStateInitialData)
    }

    const nextState = core.moveToNextStep(parameters)
    if (nextState === null) {
      return
    }

    nextStateInitialData = nextState[0]
    nextStateParameters = nextState[1]
  }
}

export default async () => {
  try {
    await main()
  } catch (error) {
    console.error(error)
  }
}
