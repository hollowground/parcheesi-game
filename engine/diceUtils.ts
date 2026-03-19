import { GameState } from "../types/GameState"

export function rollDie(): number {
    return Math.floor(Math.random() * 6) + 1
}

export function rollDice(count = 2): number[] {
    return Array.from({ length: count }, () => rollDie())
}

export function getRemainingDice(dice: number[], usedDice: number[]): number[] {
  return dice.filter(d => !usedDice.includes(d))
}

export function getAvailableDice(state: GameState): number[] {
  return getRemainingDice(state.dice, state.usedDice)
}