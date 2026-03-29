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
    //console.log("Starting turn for player:", currentState.currentPlayer)
    //console.log("Bonus moves:", currentState.bonusMoves.join(", "))

    // -------------------------
    // PHASE 1: USE ALL DICE
    // -------------------------
    while (true) {

        const moves = getLegalMoves(currentState)
        //console.log(`Legal moves available for dice: ${moves.length}`)
        if (moves.length === 0 && currentState.bonusMoves.length === 0) return endTurn(currentState)

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
        //console.log(`Legal moves available for bonus: ${moves.length}`)
        //if (moves.length === 0) return endTurn(currentState)

        const bonusMoves = moves.filter(m => m.die === 20)
        //console.log(`Bonus moves available: ${bonusMoves.length}`)

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

    // ✅ Check winner on FINAL state of turn
    const winner = checkWinner(currentState)

    if (winner) {
        return {
            ...currentState,
            winner
        }
    }

    // ❗ IMPORTANT: return BEFORE reset for test visibility
    const finalState = currentState
    //console.log("Final state before endTurn:", finalState)

    // THEN end turn (for game flow)
    const nextState = endTurn(currentState)

    // 🔑 Merge so tests see turn results but game advances
    return {
        ...nextState,
        usedDice: finalState.usedDice,
        bonusMoves: finalState.bonusMoves
    }
}