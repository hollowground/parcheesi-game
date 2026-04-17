import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { getLegalMoves } from "./getLegalMoves"
import { applyMove } from "./applyMove"
import { endTurn } from "../engine/endTurn"
import { checkWinner } from "./checkWinner"

export function playTurn(
    state: GameState,
    chooseMove: (moves: Move[], state: GameState) => Move,
    options?: {
        autoEndTurn?: boolean
        stopAfterDiceSetup?: boolean
    }
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

    // -------------------------
    // DOUBLETS BONUS
    // -------------------------
    const allPawnsOut = currentState.pawns
        .filter(p => p.player === currentState.currentPlayer)
        .every(p => p.position.type !== "start")


    if (isDoubles && allPawnsOut) {
        const die = currentState.dice[0]!
        const opposite = 7 - die

        currentState.dice = [die, die, opposite, opposite]
        currentState.usedDice = []

        console.log("Doublets bonus applied:", currentState.dice)

        if (options?.stopAfterDiceSetup) {
            return currentState
        }

        // ✅ NEW: enforce "must use all 4 or none"
        const canUseAll = canPlayAllDice(currentState)
        console.log("Checking if all dice playable:", currentState.dice)
        console.log("Can play all dice:", canUseAll)

        if (!canUseAll) {
            console.log("Cannot play all 4 parts of doublets → forfeiting turn")

            // ❗ No movement allowed at all
            currentState.usedDice = []
            currentState.bonusMoves = []

            if (options?.autoEndTurn) {
                return endTurn(currentState)
            }

            return currentState
        }
    }

    console.log("Starting turn for player:", currentState.currentPlayer)
    console.log("Bonus moves:", currentState.bonusMoves.join(", "))
    console.log("Dice:", currentState.dice)
    console.log("Used:", currentState.usedDice)

    // -------------------------
    // PHASE 1: USE ALL DICE
    // -------------------------
    while (currentState.dice.length > 0) {

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
        console.log("Dice left:", currentState.dice.filter(d => !currentState.usedDice.includes(d)).join(", "))


    }

    if (currentState.dice.length > 0) {
        console.log("Forfeiting remaining dice:", currentState.dice)
        currentState.dice = []
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

function canPlayAllDice(state: GameState): boolean {

    const visited = new Set<string>()

    function serialize(s: GameState): string {

        // ✅ derive remaining dice (order-independent)
        const remainingDice = [...s.dice]

        for (const used of s.usedDice) {
            const index = remainingDice.indexOf(used)
            if (index !== -1) {
                remainingDice.splice(index, 1)
            }
        }

        remainingDice.sort() // normalize order

        return JSON.stringify({
            remainingDice,
            pawns: s.pawns.map(p => ({
                id: p.id,
                pos: p.position
            }))
        })
    }

    function dfs(simState: GameState): boolean {

        const key = serialize(simState)

        if (visited.has(key)) {
            return false
        }
        visited.add(key)

        if (simState.usedDice.length === simState.dice.length) {
            return true
        }

        const moves = getLegalMoves(simState)
        const diceMoves = moves.filter(m => !m.isBonus)

        if (diceMoves.length === 0) {
            return false
        }

        for (const move of diceMoves) {
            const nextState = structuredClone(simState)

            // 🔥 restore full dice set before applying move
            nextState.dice = [...state.dice] // original dice from root

            // apply move
            const applied = applyMove(nextState, move)

            if (dfs(nextState)) {
                return true
            }
        }

        return false
    }

    return dfs(structuredClone(state))
}