import { SAFETY_SQUARES } from "./boardConfig"

export function isSafeSquare(position: number): boolean {
    return SAFETY_SQUARES.includes(position)
}