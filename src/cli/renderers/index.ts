import { AssignHitsAppStateEntryValues } from '../../core/appStates/assignHitsState'
import {
  Combatant,
  CombatAppStateEntryValues,
} from '../../core/appStates/combatState'
import { renderAssignHits } from './assignHitsRenderer'
import { renderCombatRolling } from './combatRollingRenderer'
import { renderFleetSetup } from './fleetSetupRenderer'

export const createFleetSetupRenderer = (combatant: string) => () =>
  renderFleetSetup(combatant)

export const createCombatStateRenderer = (combatant: Combatant) => (
  stateEntryData: CombatAppStateEntryValues
) => renderCombatRolling(combatant, stateEntryData[combatant])

export const createAssignHitsStateRenderer = (combatant: Combatant) => (
  stateEntryData: AssignHitsAppStateEntryValues
) => renderAssignHits(combatant, stateEntryData[combatant])
