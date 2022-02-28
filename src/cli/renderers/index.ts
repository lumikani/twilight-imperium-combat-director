import { AssignHitsStateEntryValues } from '../../core/appStates/assignHitsState'
import {
  Combatant,
  CombatStateEntryValues,
} from '../../core/appStates/combatState'
import { renderAssignHits } from './assignHitsRenderer'
import { renderCombatRolling } from './combatRollingRenderer'
import { renderFleetSetup } from './fleetSetupRenderer'

export const createFleetSetupRenderer = (combatant: string) => () =>
  renderFleetSetup(combatant)

export const createCombatStateRenderer = (combatant: Combatant) => (
  stateEntryData: CombatStateEntryValues
) => renderCombatRolling(combatant, stateEntryData[combatant])

export const createAssignHitsStateRenderer = (combatant: Combatant) => (
  stateEntryData: AssignHitsStateEntryValues
) => renderAssignHits(combatant, stateEntryData[combatant])
