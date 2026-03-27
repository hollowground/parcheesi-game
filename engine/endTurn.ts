import { GameState } from "../types/GameState"
import { pawnProgress } from "./boardUtils"

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
                p =>
                    p.player === player &&
                    (p.position.type === "track" || p.position.type === "homeLane")
            )

            if (playerPawns.length > 0) {

                const farthestPawn = playerPawns.reduce((farthest, pawn) =>
                    pawnProgress(pawn) > pawnProgress(farthest) ? pawn : farthest
                )
                console.log("Triple doubles! Sending farthest pawn back to start:", farthestPawn)

                farthestPawn.position = { type: "start" }

            }

            newState.consecutiveDoubles = 0
            advancePlayer(newState)
            newState.dice = []
            //newState.usedDice = []
            newState.bonusMoves = []

        }

        return newState
    }

    // normal turn end
    newState.consecutiveDoubles = 0
    advancePlayer(newState)
    newState.dice = []
    //newState.usedDice = []
    newState.bonusMoves = []

    return newState
}

function advancePlayer(state: GameState) {

    const currentIndex = state.players.indexOf(state.currentPlayer)
    const nextIndex = (currentIndex + 1) % state.players.length

    state.currentPlayer = state.players[nextIndex]!

}