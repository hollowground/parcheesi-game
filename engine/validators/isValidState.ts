import { GameState } from "../../types/GameState"

export function isValidState(state: GameState): boolean {

    // 1. No pawn should be beyond home
    for (const pawn of state.pawns) {
        if (pawn.position.type === "homeLane" && pawn.position.index < 0) {
            return false
        }
    }

    // 2. No duplicate pawn IDs
    const ids = new Set()
    for (const pawn of state.pawns) {
        if (ids.has(pawn.id)) return false
        ids.add(pawn.id)
    }

    // 3. Dice consistency
    if (state.usedDice.some(d => !state.dice.includes(d))) {
        return false
    }

    return true
}