import { Strategy } from "./types"

// ⚠️ Assumes your move object has:
// - captures?: boolean
// - endPosition or similar (you may need to adjust this)

export const captureSafetyStrategy: Strategy = ({ moves }) => {

    // 1. 🎯 Capture priority
    const captureMoves = moves
        .map((move, index) => ({ move, index }))
        .filter(m => m.move.captures)

    if (captureMoves.length > 0) {
        return captureMoves[0]!.index
    }

    // 2. 🛡️ Safety heuristic (basic version)
    // Prefer moves that land on "safe" tiles (you may define this later)

    const safeMoves = moves
        .map((move, index) => ({ move, index }))
        .filter(m => m.move.isSafe) // <-- you may not have this yet

    if (safeMoves.length > 0) {
        return safeMoves[0]!.index
    }

    // 3. 🎲 Fallback: random
    return Math.floor(Math.random() * moves.length)
}