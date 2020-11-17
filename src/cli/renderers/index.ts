import {
  Combatant,
  CombatStateEntryValues,
} from '../../core/appStates/combatState'
import { renderCombatRolling } from './combatRollingRenderer'
import { renderFleetSetup } from './fleetSetupRenderer'

export const createFleetSetupRenderer = (combatant: string) => () =>
  renderFleetSetup(combatant)

export const createCombatStateRenderer = (combatant: Combatant) => (
  stateEntryData: CombatStateEntryValues
) => renderCombatRolling(combatant, stateEntryData[combatant])
