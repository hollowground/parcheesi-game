import { GameState } from "../types/GameState"

export function endTurn(state: GameState): GameState {

    const newState = structuredClone(state)

    // reset doubles (only if turn actually ends)
    newState.consecutiveDoubles = 0

    advancePlayer(newState)

    newState.dice = []
    newState.usedDice = []
    newState.bonusMoves = []

    return newState
}

function advancePlayer(state: GameState) {

    const currentIndex = state.players.indexOf(state.currentPlayer)
    const nextIndex = (currentIndex + 1) % state.players.length

    state.currentPlayer = state.players[nextIndex]!
}