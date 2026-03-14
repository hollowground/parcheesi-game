import { GameState } from "../types/GameState"
import { Move } from "../types/Move"

import { getEntryMoves } from "../rules/entryRules"
import { getMovementMoves } from "../rules/movementRules"
import { ENTRY_INDEX } from "./boardConfig"

export function getLegalMoves(state: GameState): Move[] {

  const entryMoves = getEntryMoves(state)
  console.log(`Entry moves available: ${entryMoves.length}`)

  // entry available → must take it
  if (entryMoves.length > 0) {
    return entryMoves
  }

  const rolledFive = state.dice.includes(5)
  console.log(`Rolled a 5: ${rolledFive}`)
  console.log(`Die rolled: ${state.dice.join(", ")}`)

  const hasStartPawn = state.pawns.some(
    p => p.player === state.currentPlayer && p.position.type === "start"
  )
  console.log(`Has pawn in start: ${hasStartPawn}`)

  const entryIndex = ENTRY_INDEX[state.currentPlayer]

  const entryOccupants = state.pawns.filter(
    p => p.position.type === "track" && p.position.index === entryIndex
  )
  console.log(`Entry square occupants: ${entryOccupants.length}`)

  const entryBlocked = entryOccupants.length >= 2
  console.log(`Entry square blocked: ${entryBlocked}`)

  // special rule: 5 rolled but entry blocked
  if (rolledFive && hasStartPawn && entryBlocked) {
    return []
  }

  console.log(`No entry moves, checking movement moves: ${JSON.stringify(getMovementMoves(state))}`)

  return getMovementMoves(state)
}