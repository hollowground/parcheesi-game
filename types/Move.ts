import { Position } from './GameState'

export interface Move {
    pawnId: number

    // NEW (future-proof)
    diceUsed?: number[]
    distance?: number

    // OLD (temporary, for compatibility)
    die?: number
    dieIndex?: number

    from: Position
    to: Position

    capture?: boolean
    enterFromStart?: boolean
    finish?: boolean

    isBonus?: boolean // ✅ ADD THIS
}