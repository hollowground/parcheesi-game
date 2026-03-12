import { GameState } from "../types/GameState"
import { Move } from "../types/Move"

export function applyMove(state: GameState, move: Move): GameState {

    const newState = structuredClone(state)

    const pawn = newState.pawns.find(p => p.id === move.pawnId)

    if (!pawn) {
        throw new Error(`Pawn ${move.pawnId} not found`)
    }

    pawn.position = move.to

    return newState
}