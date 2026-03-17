import { GameState } from "../types/GameState"

export function endTurn(state: GameState): GameState {

    const newState = structuredClone(state)

    const [d1, d2] = newState.dice

    const isDouble = d1 === d2

    if (isDouble) {
        newState.consecutiveDoubles += 1
        return newState
    }

    newState.consecutiveDoubles = 0

    const currentIndex = newState.players.indexOf(newState.currentPlayer)
    const nextIndex = (currentIndex + 1) % newState.players.length

    newState.currentPlayer = newState.players[nextIndex]!

    return newState
}