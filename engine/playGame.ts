import { GameState, PlayerColor } from "../types/GameState"
import { playTurn } from "./playTurn"
import { checkWinner } from "./checkWinner"
import { rollDice } from "./diceUtils"

export type GameResult = {
    finalState: GameState
    winner: PlayerColor
    turnCount: number
}

export function playGame(
    initialState: GameState,
    strategies: Partial<Record<PlayerColor, (moves: any[]) => number>>
): GameResult {

    let state = initialState

    // ✅ 1. Check BEFORE loop
    const initialWinner = checkWinner(state)
    if (initialWinner) {
        return {
            finalState: { ...state, winner: initialWinner },
            winner: initialWinner,
            turnCount: 0
        }
    }

    let turnCount = 0
    const MAX_TURNS = 1000

    while (!state.winner && turnCount < MAX_TURNS) {

        state = {
            ...state,
            dice: rollDice(),
            usedDice: [],
        }

        const strategy = strategies[state.currentPlayer]!


        state = playTurn(state, (moves) => {
            const index = strategy(moves)
            return moves[index]!
        })

        const winner = checkWinner(state)
        if (winner) {
            return {
                finalState: { ...state, winner },
                winner,
                turnCount
            }
        }

        turnCount++
    }

    throw new Error("Game did not finish within turn limit")
}