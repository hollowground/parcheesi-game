import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import {
    getEnemyPawnsOnSquare,
    getPawnsOnSquare,
    isSafeSquare
} from "../engine/boardUtils"

import {
    TRACK_LENGTH,
    HOME_ENTRY_INDEX,
    HOME_LENGTH
} from "../engine/boardConfig"

export function getMovementMoves(state: GameState): Move[] {

    const moves: Move[] = []

    const availableDice = state.dice.filter(
        die => !state.usedDice.includes(die)
    )

    for (const pawn of state.pawns) {

        if (pawn.player !== state.currentPlayer) continue

        for (const die of availableDice) {

            /*
            -----------------------
            HOME LANE MOVEMENT
            -----------------------
            */

            if (pawn.position.type === "homeLane") {

                const start = pawn.position.index
                const destination = start + die
                console.log(`Pawn ${pawn.id} in home lane at ${start} rolls ${die}, destination would be ${destination}`)

                // exact roll to home
                if (destination === HOME_LENGTH ) {

                    moves.push({
                        pawnId: pawn.id,
                        from: pawn.position,
                        to: { type: "home" },
                        die
                    })

                }
                else if (destination < HOME_LENGTH) {

                    moves.push({
                        pawnId: pawn.id,
                        from: pawn.position,
                        to: { type: "homeLane", index: destination },
                        die
                    })

                }

                continue
            }

            /*
            -----------------------
            TRACK MOVEMENT
            -----------------------
            */

            if (pawn.position.type !== "track") continue

            const start = pawn.position.index
            const entry = HOME_ENTRY_INDEX[pawn.player]

            const distanceToEntry =
                (entry - start + TRACK_LENGTH) % TRACK_LENGTH
            console.log(`Pawn ${pawn.id} at ${start} has distance ${distanceToEntry} to entry ${entry}`)

            /*
            -----------------------
            TRACK → HOME LANE
            -----------------------
            */

            if (die > distanceToEntry) {

                const homeIndex = die - distanceToEntry
                console.log(`Die ${die} exceeds entry by ${die - distanceToEntry}, home index would be ${homeIndex}`)

                if (homeIndex < HOME_LENGTH) {

                    moves.push({
                        pawnId: pawn.id,
                        from: pawn.position,
                        to: { type: "homeLane", index: homeIndex },
                        die
                    })

                }

                continue
            }

            /*
            -----------------------
            NORMAL TRACK MOVEMENT
            -----------------------
            */

            const destination = (start + die) % TRACK_LENGTH

            let blocked = false

            for (let step = 1; step < die; step++) {

                const square = (start + step) % TRACK_LENGTH

                const occupants = getPawnsOnSquare(state, square)

                if (occupants.length >= 2) {
                    blocked = true
                    break
                }

            }

            if (blocked) continue

            const occupants = getPawnsOnSquare(state, destination)

            if (occupants.length >= 2) continue

            const enemies = getEnemyPawnsOnSquare(
                state,
                destination,
                pawn.player
            )

            moves.push({
                pawnId: pawn.id,
                from: pawn.position,
                to: { type: "track", index: destination },
                die,
                capture: enemies.length > 0 && !isSafeSquare(destination)
            })

        }

    }

    return moves
}