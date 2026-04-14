import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { getLegalMoves } from "./getLegalMoves"
import { applyMove } from "./applyMove"
import { endTurn } from "../engine/endTurn"
import { checkWinner } from "./checkWinner"

export function playTurn(
    state: GameState,
    chooseMove: (moves: Move[], state: GameState) => Move,
    options?: { autoEndTurn?: boolean }
): GameState {

    let currentState = structuredClone(state)

    const isDoubles =
        currentState.dice.length === 2 &&
        currentState.dice[0] === currentState.dice[1]

    console.log(
        `Player ${currentState.currentPlayer} rolled: ${currentState.dice.join(", ")}${isDoubles ? " (DOUBLES!)" : ""}`
    )

    // -------------------------
    // HANDLE DOUBLES COUNT
    // -------------------------
    if (isDoubles) {
        currentState.consecutiveDoubles += 1
    } else {
        currentState.consecutiveDoubles = 0
    }

    // -------------------------
    // TRIPLE DOUBLES PENALTY
    // -------------------------
    if (currentState.consecutiveDoubles === 3) {

        const playerPawns = currentState.pawns.filter(
            p => p.player === currentState.currentPlayer
        )

        console.log("Player has rolled triple doubles! Pawns:", playerPawns)

        // ✅ Normalize all positions into comparable distance
        function getDistance(pawn: typeof playerPawns[number]): number {
            const pos = pawn.position

            if (pos.type === "start") return -1

            if (pos.type === "track") return pos.index

            if (pos.type === "homeLane") return 100 + pos.index

            if (pos.type === "home") return 1000

            return -1
        }

        const farthest = playerPawns.reduce((a, b) =>
            getDistance(b) > getDistance(a) ? b : a
        )

        console.log("Triple doubles! Farthest pawn:", farthest)

        // ✅ Send that pawn back to start (unless already home)
        if (farthest.position.type !== "home") {
            farthest.position = { type: "start" }
        }

        currentState.consecutiveDoubles = 0

        return endTurn(currentState)
    }

    console.log("Starting turn for player:", currentState.currentPlayer)
    console.log("Bonus moves:", currentState.bonusMoves.join(", "))

    // -------------------------
    // PHASE 1: USE ALL DICE
    // -------------------------
    while (currentState.dice.length >= currentState.usedDice.length) {

        const moves = getLegalMoves(currentState)
        console.log(`Legal moves available for dice: ${moves.length}`)

        // Only allow dice moves
        const diceMoves = moves.filter(m => m.isBonus !== true)
        console.log(`Moves available for dice: ${JSON.stringify(diceMoves)}`)

        if (diceMoves.length === 0) break

        const move = chooseMove(diceMoves, currentState)
        console.log(`Chosen move:`, move)

        currentState = applyMove(currentState, move)
        console.log("State after move:", currentState)

    }

    // -------------------------
    // PHASE 2: USE BONUS
    // -------------------------
    while (currentState.bonusMoves.length > 0) {

        const moves = getLegalMoves(currentState)

        // Only allow bonus moves
        const bonusMoves = moves.filter(m => m.isBonus === true)

        if (bonusMoves.length === 0) {
            // ❗ FORFEIT remaining bonuses
            currentState.bonusMoves = []
            break
        }

        const move = chooseMove(bonusMoves, currentState)

        currentState = applyMove(currentState, move)
        console.log("State after bonus move:", currentState.pawns)
    }

    // -------------------------
    // CHECK WINNER
    // -------------------------
    const winner = checkWinner(currentState)

    if (winner) {
        return {
            ...currentState,
            winner
        }
    }

    // -------------------------
    // DOUBLES → SAME PLAYER GOES AGAIN
    // -------------------------
    if (isDoubles) {
        return currentState
    }

    // -------------------------
    // RETURN MODE CONTROL
    // -------------------------
    if (options?.autoEndTurn) {
        return endTurn(currentState)
    }

    // -------------------------
    // Default: return mid-turn state (for tests)
    // -------------------------
    return currentState

}