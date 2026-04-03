import { Strategy } from "./types"

export const greedyStrategy: Strategy = ({ moves }) => {
    const index = moves.findIndex(m => m.to.type === 'home')
    if (index !== -1) return index

    return 0
}