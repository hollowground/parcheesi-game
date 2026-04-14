import { GameState, Pawn, PlayerColor } from "../types/GameState"
import { SAFETY_SQUARES } from "./boardConfig"


export function isSafeSquare(index: number) {
    return SAFETY_SQUARES.includes(index)
}

export function getPawnsOnSquare(state: GameState, index: number) {
    return state.pawns.filter(
        p => p.position.type === "track" && p.position.index === index
    )
}

export function isBlockade(state: GameState, index: number): boolean {
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
    player: PlayerColor
) {
    return getPawnsOnSquare(state, index).filter(
        p => p.player !== player
    )
}

export function pawnProgress(pawn: Pawn): number {

    switch (pawn.position.type) {

        case "start":
            return -1

        case "track":
            return pawn.position.index

        case "homeLane":
            return 100 + pawn.position.index

        case "home":
            return 200
    }

}
