import { GameState } from "../types/GameState"
import { Move } from "../types/Move"

import {
    getEnemyPawnsOnSquare,
    getPawnsOnSquare,
    isSafeSquare
} from "../engine/boardUtils"

import { simulateMovement } from "../engine/simulateMovement"

export function getMovementMoves(state: GameState): Move[] {

    const moves: Move[] = []

    const availableDice = state.dice.filter(
        die => !state.usedDice.includes(die)
    )

    for (const pawn of state.pawns) {

        if (pawn.player !== state.currentPlayer) continue

        // pawns in start or home cannot move normally
        if (pawn.position.type === "start") continue
        if (pawn.position.type === "home") continue

        for (const die of availableDice) {

            const destination = simulateMovement(state, pawn, die)

            if (!destination) continue

            /*
            -----------------------
            TRACK LANDING RULES
            -----------------------
            */

            if (destination.type === "track") {

                const occupants = getPawnsOnSquare(state, destination.index)

                // cannot land on blockade
                if (occupants.length >= 2) continue

                const enemies = getEnemyPawnsOnSquare(
                    state,
                    destination.index,
                    pawn.player
                )

                moves.push({
                    pawnId: pawn.id,
                    from: pawn.position,
                    to: destination,
                    die,
                    capture: enemies.length > 0 && !isSafeSquare(destination.index)
                })

                continue
            }

            /*
            -----------------------
            HOME LANE / HOME
            -----------------------
            */

            moves.push({
                pawnId: pawn.id,
                from: pawn.position,
                to: destination,
                die
            })

        }

    }

    return moves
}