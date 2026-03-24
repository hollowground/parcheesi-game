import { GameState, PlayerColor } from "../types/GameState"
import { playTurn } from "./playTurn"
import { checkWinner } from "./checkWinner"

export function playGame(
    initialState: GameState,
    strategies: Partial<Record<PlayerColor, (moves: any[]) => number>>
): GameState {

    let state = initialState

    // ✅ 1. Check BEFORE loop
    const initialWinner = checkWinner(state)
    if (initialWinner) {
        return { ...state, winner: initialWinner }
    }

    let turnCount = 0
    const MAX_TURNS = 1000

    while (!state.winner && turnCount < MAX_TURNS) {

        const strategy = strategies[state.currentPlayer]!

        state = playTurn(state, (moves) => {
            const index = strategy(moves)
            return moves[index]!
        })

        const winner = checkWinner(state)
        if (winner) {
            return { ...state, winner }
        }

        turnCount++
    }

    throw new Error("Game did not finish within turn limit")
}