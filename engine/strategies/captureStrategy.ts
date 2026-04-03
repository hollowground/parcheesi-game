import { Strategy } from "./types"

export const captureStrategy: Strategy = ({ moves }) => {
    const captureIndex = moves.findIndex(m => m.captures)

    if (captureIndex !== -1) {
        return captureIndex
    }

    return Math.floor(Math.random() * moves.length)
}