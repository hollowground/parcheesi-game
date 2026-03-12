import { GameState } from "../types/GameState"
import { Move } from "../types/Move"

import { getPawnsOnSquare } from "../engine/boardUtils"

const TRACK_LENGTH = 68

export function getMovementMoves(state: GameState): Move[] {

    const moves: Move[] = []

    const availableDice = state.dice.filter(
        die => !state.usedDice.includes(die)
    )

    for (const pawn of state.pawns) {

        if (pawn.player !== state.currentPlayer) continue
        if (pawn.position.type !== "track") continue

        for (const die of availableDice) {

            const start = pawn.position.index
            const destination = (start + die) % TRACK_LENGTH

            let blocked = false

            // scan path excluding destination
            for (let step = 1; step < die; step++) {

                const square = (start + step) % TRACK_LENGTH

                const occupants = getPawnsOnSquare(state, square)

                // ANY blockade blocks movement
                if (occupants.length >= 2) {
                    blocked = true
                    break
                }

            }

            if (blocked) continue

            const occupants = getPawnsOnSquare(state, destination)

            // cannot land on ANY blockade
            if (occupants.length >= 2) continue

            moves.push({
                pawnId: pawn.id,
                from: pawn.position,
                to: { type: "track", index: destination },
                die
            })

        }

    }

    return moves
}