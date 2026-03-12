export function isSafeSquare(position: number): boolean {
    const safeSquares = [5, 12, 17, 22, 29, 34, 39, 46]
    return safeSquares.includes(position)
}