import { GameState } from "../types/GameState"

export function getPawnsOnSquare(state: GameState, index: number) {
    return state.pawns.filter(
        p => p.position.type === "track" && p.position.index === index
    )
}

export function isBlockade(state: GameState, index: number) {
    return getPawnsOnSquare(state, index).length >= 2
}

export function getBlockadeOwner(state: GameState, index: number) {

    const pawns = getPawnsOnSquare(state, index)

    if (pawns.length < 2) return undefined

    const owner = pawns[0]!.player

    if (pawns.every(p => p.player === owner)) {
        return owner
    }

    return undefined
}

export function getEnemyPawnsOnSquare(
    state: GameState,
    index: number,
    player: string
) {
    return getPawnsOnSquare(state, index).filter(
        p => p.player !== player
    )
}