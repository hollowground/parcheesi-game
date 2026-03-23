import { GameState } from "../types/GameState"
import { checkWinner } from "./checkWinner"

export function playGame(
    initialState: GameState,
    strategyMap: Record<string, (moves: any[]) => number>
): { winner?: string } {

    let state = { ...initialState }

    // 🟡 try winner immediately
    /*
    for (const player of state.players) {
        const pawns = state.pawns.filter(p => p.player === player)
        console.log(`Checking player ${player} with pawns:`, pawns)

        const allHome =
            pawns.length > 0 &&
            pawns.every(p => p.position.type === "home")

        console.log(`All pawns home for ${player}?`, allHome)

        if (allHome) {
            return { winner: player }
        }
    } */

    const isWinner = checkWinner(state)
    console.log("Winner after initial check:", isWinner)
    if (isWinner) {
        return { winner: isWinner }
    }
    else {
        console.log("No winner at start of game.")
        return {}
    }


    // 🟡 TEMP: fallback so test passes
    //return { winner: state.players[0]! }
}