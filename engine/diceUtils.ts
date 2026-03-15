import { GameState } from "../types/GameState"

export function rollDie(): number {
    return Math.floor(Math.random() * 6) + 1
}

export function rollDice(count = 2): number[] {
    return Array.from({ length: count }, () => rollDie())
}

export function getAvailableDice(state: GameState): number[] {
    return state.dice.filter(
        d => !state.usedDice.includes(d)
    )
}