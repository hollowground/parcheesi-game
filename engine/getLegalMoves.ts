import { GameState } from "../types/GameState"
import { Move } from "../types/Move"

import { getEntryMoves } from "../rules/entryRules"
import { getMovementMoves } from "../rules/movementRules"
import { ENTRY_INDEX } from "./boardConfig"
import { getAvailableDice } from "./diceUtils"

export function getLegalMoves(state: GameState): Move[] {

  // 🥇 ENTRY RULE (still highest priority)
  const entryMoves = getEntryMoves(state)
  console.log(`Entry moves available: ${entryMoves.length}`)

  if (entryMoves.length > 0) {
    return entryMoves
  }

  // 🥈 BONUS PRIORITY
  if (state.bonusMoves.length > 0) {

    console.log(`Trying bonus moves: ${state.bonusMoves.join(", ")}`)

    const bonusMoves = generateMovesForDice(state, state.bonusMoves)

    console.log(`Bonus moves found: ${bonusMoves.length}`)

    if (bonusMoves.length > 0) {
      return bonusMoves
    }

    console.log(`Bonus unusable → falling back to dice`)
  }

  // 🥉 NORMAL DICE
  const remainingDice = getAvailableDice(state)

  console.log(`Using dice: ${remainingDice.join(", ")}`)

  return generateMovesForDice(state, remainingDice)
}

function generateMovesForDice(state: GameState, dice: number[]): Move[] {

  const tempState: GameState = {
    ...state,
    dice,
    usedDice: []
  }

  const entryMoves = getEntryMoves(tempState)

  if (entryMoves.length > 0) {
    return entryMoves
  }

  return getMovementMoves(tempState)
}