import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { applyMove } from "../engine/applyMove"
import { GameState } from "../types/GameState"

describe("Home Entry Rules", () => {

    it("allows exact roll into home", () => {

        const state: GameState = {
            players: ["red"],
            currentPlayer: "red",

            dice: [1],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "homeLane", index: 6 } }
            ]
        }

        const moves = getLegalMoves(state)
        expect(moves.length).toBeGreaterThan(0)

        const newState = applyMove(state, moves[0]!)

        expect(newState.pawns[0]!.position.type).toBe("home")

    })

    it("does NOT allow overshooting home", () => {

        const state: GameState = {
            players: ["red"],
            currentPlayer: "red",

            dice: [2],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "homeLane", index: 6 } }
            ]
        }

        const moves = getLegalMoves(state)
        console.log(`Legal moves: ${moves.length}`)

        expect(moves.length).toBe(0)

    })

    it("does not allow entering home without exact roll", () => {

        const state: GameState = {
            players: ["red"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "homeLane", index: 5 } }
            ]
        }

        const moves = getLegalMoves(state)
        console.log(`Legal moves: ${moves.length}`)

        // Needs exactly 2, not 3
        expect(moves.length).toBe(0)

    })

    it("moves correctly within homeLane before entering home", () => {

        const state: GameState = {
            players: ["red"],
            currentPlayer: "red",

            dice: [2],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "homeLane", index: 3 } }
            ]
        }

        const moves = getLegalMoves(state)
        const newState = applyMove(state, moves[0]!)

        expect(newState.pawns[0]!.position).toEqual({
            type: "homeLane",
            index: 5
        })

    })

})