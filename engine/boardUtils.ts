import { GameState } from "../types/GameState"

export function getPawnsOnSquare(state: GameState, index: number) {
    return state.pawns.filter(
        p => p.position.type === "track" && p.position.index === index
    )
}

export function isBlockade(state: GameState, index: number) {
    return getPawnsOnSquare(state, index).length >= 2
}