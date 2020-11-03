import core from '../core'
import {
  FLEET_SETUP_DEFENDER,
  FLEET_SETUP_ATTACKER,
} from '../core/appStates/fleetSetupState'
import { AppStateParameters, AppStateParametersObject } from '../core/'
import { createFleetSetupRenderer } from './renderers'

const appStateRenderers: Record<string, Function> = {
  [FLEET_SETUP_DEFENDER]: createFleetSetupRenderer('defender'),
  [FLEET_SETUP_ATTACKER]: createFleetSetupRenderer('attacker'),
}

const main = async () => {
  let nextStateParameters: AppStateParameters | undefined = core.beginCombat()

  while (nextStateParameters !== undefined && nextStateParameters.length > 0) {
    const parameters: AppStateParametersObject = {}
    for (const nextStateParameter of nextStateParameters) {
      parameters[nextStateParameter] = await appStateRenderers[
        nextStateParameter
      ]()
    }

    nextStateParameters = core.moveToNextStep(parameters)
  }
}

export default async () => {
  try {
    const text = await main()
    console.log(text)
  } catch (error) {
    console.error(error)
  }
}
