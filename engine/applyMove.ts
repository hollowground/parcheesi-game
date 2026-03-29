import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { getEnemyPawnsOnSquare, isSafeSquare } from "../engine/boardUtils"

export function applyMove(state: GameState, move: Move): GameState {

    const newState = structuredClone(state)
    // ✅ consume die (ONLY if it's from dice, not bonus)
    if (state.dice.includes(move.die)) {
        newState.usedDice.push(move.die)
    }

    const pawn = newState.pawns.find(p => p.id === move.pawnId)

    if (!pawn) {
        throw new Error(`Pawn ${move.pawnId} not found`)
    }

    // move pawn
    pawn.position = move.to

    // capture check (track only)
    if (move.to.type === "track") {

        const destinationIndex = move.to.index
        //console.log(`Pawn ${pawn.id} moved to track index ${destinationIndex}`)
        //console.log(`Is this a safe square? ${isSafeSquare(destinationIndex)}`)

        if (!isSafeSquare(destinationIndex)) {

            const enemies = getEnemyPawnsOnSquare(
                newState,
                destinationIndex,
                pawn.player
            )
            //console.log(`Enemies on destination square: ${enemies.map(e => e.id).join(", ")}`)

            if (move.capture) {

                for (const enemy of enemies) {
                    enemy.position = { type: "start" }
                }

                // capture bonus
                newState.bonusMoves.push(20)

            }

        }

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