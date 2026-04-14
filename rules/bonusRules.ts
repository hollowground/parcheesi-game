import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { simulateMovement } from "../engine/simulateMovement"
import { isBlockade } from "../engine/boardUtils"

export function getBonusMoves(state: GameState): Move[] {
    const moves: Move[] = []

    for (const bonus of state.bonusMoves) {

        for (const pawn of state.pawns) {

            if (pawn.player !== state.currentPlayer) continue
            if (pawn.position.type === "start") continue
            if (pawn.position.type === "home") continue

            const destination = simulateMovement(state, pawn, bonus)

            if (!destination) continue

            // -----------------------
            // 🚫 BLOCKADE LANDING RULE
            // -----------------------
            if (destination.type === "track") {
                if (isBlockade(state, destination.index)) continue
            }

            moves.push({
                pawnId: pawn.id,
                from: pawn.position,
                to: destination,
                distance: bonus,
                isBonus: true
            })
        }
    }

    return moves
}