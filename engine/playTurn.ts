import { GameState } from "../types/GameState"
import { Move } from "../types/Move"
import { getLegalMoves } from "./getLegalMoves"
import { applyMove } from "./applyMove"

export function playTurn(
    state: GameState,
    chooseMove: (moves: Move[], state: GameState) => Move
): GameState {

    let currentState = structuredClone(state)

    while (true) {

        const moves = getLegalMoves(currentState)

        if (moves.length === 0) break

        const move = chooseMove(moves, currentState)

        currentState = applyMove(currentState, move)
    }

    return currentState
}