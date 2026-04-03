import { Strategy } from "./types"

export const randomStrategy: Strategy = ({ moves }) => {
    return Math.floor(Math.random() * moves.length)
}