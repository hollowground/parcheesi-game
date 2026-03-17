import { GameState } from "../types/GameState"

export function endTurn(state: GameState): GameState {

    const newState = structuredClone(state)

    const [d1, d2] = newState.dice
    const isDouble = d1 === d2

    if (isDouble) {
        newState.consecutiveDoubles += 1

        // RULE-DOUBLES-002: triple doubles penalty
        if (newState.consecutiveDoubles === 3) {

            const player = newState.currentPlayer

            const playerPawns = newState.pawns.filter(
                p => p.player === player && p.position.type === "track"
            )

            if (playerPawns.length > 0) {

                const farthestPawn = playerPawns.reduce((farthest, pawn) => {

                    const farthestIndex = (farthest.position as { type: "track", index: number }).index
                    const pawnIndex = (pawn.position as { type: "track", index: number }).index

                    return pawnIndex > farthestIndex ? pawn : farthest
                })

                farthestPawn.position = { type: "start" }

            }

            newState.consecutiveDoubles = 0
            advancePlayer(newState)

        }

        return newState
    }

    // normal turn end
    newState.consecutiveDoubles = 0
    advancePlayer(newState)

    return newState
}

function advancePlayer(state: GameState) {

    const currentIndex = state.players.indexOf(state.currentPlayer)
    const nextIndex = (currentIndex + 1) % state.players.length

    state.currentPlayer = state.players[nextIndex]!

}