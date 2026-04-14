import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { getEnemyPawnsOnSquare, isSafeSquare } from "../engine/boardUtils"

export function applyMove(state: GameState, move: Move): GameState {

    const newState = structuredClone(state)

    /*
    -----------------------
    CONSUME DICE (SINGLE SOURCE OF TRUTH)
    -----------------------
    */

    // ✅ Multi-dice (combined moves)
    if (move.diceUsed && move.diceUsed.length > 0) {

        for (const die of move.diceUsed) {
            const index = newState.dice.findIndex(d => d === die)

            // Only consume if present (prevents bonus like 10/20 from crashing)
            if (index !== -1) {
                const [used] = newState.dice.splice(index, 1)
                newState.usedDice.push(used!)
            }
        }

    }
    // ✅ Single die
    else if (move.die !== undefined) {

        const index = newState.dice.findIndex(d => d === move.die)

        // Only consume if present
        if (index !== -1) {
            const [used] = newState.dice.splice(index, 1)
            newState.usedDice.push(used!)
        }
    }

    /*
    -----------------------
    MOVE PAWN
    -----------------------
    */

    const pawn = newState.pawns.find(p => p.id === move.pawnId)

    if (!pawn) {
        throw new Error(`Pawn ${move.pawnId} not found`)
    }

    pawn.position = move.to

    /*
    -----------------------
    CAPTURE LOGIC
    -----------------------
    */

    if (move.to.type === "track") {

        const destinationIndex = move.to.index

        if (!isSafeSquare(destinationIndex)) {

            const enemies = getEnemyPawnsOnSquare(
                newState,
                destinationIndex,
                pawn.player
            )

            if (move.capture) {

                for (const enemy of enemies) {
                    enemy.position = { type: "start" }
                }

                // ✅ Capture bonus
                newState.bonusMoves.push(20)
            }
        }
    }

    /*
    -----------------------
    CAPTURE BONUS (SAFE SQUARE)
    -----------------------
    */

    if (move.isBonus === true) {
        newState.bonusMoves.shift()
    }

    /*
    -----------------------
    HOME BONUS
    -----------------------
    */

    if (move.to.type === "home") {
        newState.bonusMoves.push(10)
    }

    return newState
}