import { GameState } from "../types/GameState"
import { Move } from "../types/Move"

import { getEntryMoves } from "../rules/entryRules"
import { getMovementMoves } from "../rules/movementRules"
import { getAvailableDice } from "./diceUtils"

export function getLegalMoves(state: GameState): Move[] {

  // 🥇 ENTRY RULE (always first)
  const entryMoves = getEntryMoves(state)
  //console.log(`Entry moves available: ${entryMoves.length}`)

  if (entryMoves.length > 0) {
    return entryMoves
  }

  // 🥈 DICE PHASE (must be completed first)
  const remainingDice = getAvailableDice(state)

  if (remainingDice.length > 0) {
    console.log(`Using dice: ${remainingDice.join(", ")}`)
    return generateMovesForDice(state, remainingDice)
  }

  // 🥉 BONUS PHASE (ONLY after dice are done)
  if (state.bonusMoves.length > 0) {

    console.log(`Attempting bonus moves: ${state.bonusMoves.join(", ")}`)

    const bonusMoves = generateMovesForDice(state, state.bonusMoves)

    console.log(`Bonus moves found: ${bonusMoves.length}`)

    if (bonusMoves.length > 0) {
      return bonusMoves
    }

    // ❗ FORFEIT RULE
    console.log(`No valid bonus moves → forfeiting bonuses`)

    // IMPORTANT: we do NOT mutate state here
    // forfeiting should happen in the TURN ENGINE, not here

    return []
  }

  // ✅ nothing left to do
  return []
}

function generateMovesForDice(state: GameState, dice: number[]): Move[] {

  const tempState: GameState = {
    ...state,
    dice,
    usedDice: []
  }

  return getMovementMoves(tempState)
}