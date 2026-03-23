import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { getLegalMoves } from "./getLegalMoves"
import { applyMove } from "./applyMove"
import { endTurn } from "../engine/endTurn"
import { checkWinner } from "./checkWinner"

export function playTurn(
    state: GameState,
    chooseMove: (moves: Move[], state: GameState) => Move
): GameState {

    let currentState = structuredClone(state)

    // -------------------------
    // PHASE 1: USE ALL DICE
    // -------------------------
    while (true) {

        const moves = getLegalMoves(currentState)

        // Only allow moves that use dice
        const diceMoves = moves.filter(m => m.die !== 20)

        if (diceMoves.length === 0) break

        const move = chooseMove(diceMoves, currentState)

        currentState = applyMove(currentState, move)
    }

    // -------------------------
    // PHASE 2: USE BONUS (ONCE PER BONUS)
    // -------------------------
    while (currentState.bonusMoves.length > 0) {

        const moves = getLegalMoves(currentState)

        const bonusMoves = moves.filter(m => m.die === 20)

        if (bonusMoves.length === 0) {
            // ❗ FORFEIT remaining bonuses
            currentState.bonusMoves = []
            break
        }

        const move = chooseMove(bonusMoves, currentState)

        currentState = applyMove(currentState, move)

        // 🔑 CRITICAL: consume ONE bonus explicitly
        currentState.bonusMoves.shift()
    }

    const winner = checkWinner(state)

    if (winner) {
        return {
            ...state,
            winner
        }
    } else {

        return endTurn(currentState)
    }
}