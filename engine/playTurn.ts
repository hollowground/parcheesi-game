import { GameState } from "../types/GameState"
import { Move } from "../types/Move"

export function playTurn(
    state: GameState,
    chooseMove: (moves: Move[], state: GameState) => Move
): GameState {
    return state
}