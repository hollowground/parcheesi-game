import { GameState, PlayerColor } from "../types/GameState"
import { Strategy } from "./strategies/types"

import {
    startGame,
    playAITurn,
    GameControllerState
} from "./controller/GameController"

import { checkWinner } from "./checkWinner"

export type GameResult = {
    finalState: GameState
    winner: PlayerColor
    turnCount: number
}

export function playGame(
    initialState: GameState,
    strategies: Partial<Record<PlayerColor, Strategy>>
): GameResult {

    let ctrl: GameControllerState = startGame(initialState)

    // ✅ Check BEFORE loop (preserve your existing behavior)
    const initialWinner = checkWinner(ctrl.state)
    if (initialWinner) {
        return {
            finalState: { ...ctrl.state, winner: initialWinner },
            winner: initialWinner,
            turnCount: 0
        }
    }

    let turnCount = 0
    const MAX_TURNS = 1000

    while (ctrl.phase !== "GAME_OVER" && turnCount < MAX_TURNS) {

        const player = ctrl.state.currentPlayer
        const strategy = strategies[player]!

        // 🔥 Adapter: convert your Strategy → controller format
        const adaptedStrategy = (moves: any[], state: GameState) => {
            return strategy({
                state,
                player,
                moves
            })
        }

        ctrl = playAITurn(ctrl, adaptedStrategy)

        turnCount++
    }

    if (!ctrl.state.winner) {
        throw new Error("Game did not finish within turn limit")
    }

    return {
        finalState: ctrl.state,
        winner: ctrl.state.winner,
        turnCount
    }
}