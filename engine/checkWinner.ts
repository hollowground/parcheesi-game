import { GameState, PlayerColor } from "../types/GameState"

export function checkWinner(state: GameState): PlayerColor | undefined {
    for (const player of state.players) {
        const pawns = state.pawns.filter(p => p.player === player)

        const allHome =
            pawns.length === 4 &&
            pawns.every(p => p.position.type === "home")

        if (allHome) return player
    }

    return undefined
}