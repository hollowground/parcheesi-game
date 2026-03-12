import { Position } from './GameState'

export interface Move {
    pawnId: number
    die: number

    from: Position
    to: Position

    capture?: boolean
    enterFromStart?: boolean
    finish?: boolean
}