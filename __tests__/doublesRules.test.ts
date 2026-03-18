import { describe, it, expect } from "vitest"
import { endTurn } from "../engine/endTurn"
import { GameState } from "../types/GameState"

describe("Doubles Rules (RULE-DOUBLES)", () => {

    it("RULE-DOUBLES-001: doubles grant another roll", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [4, 4],
            usedDice: [4, 4],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: []
        }

        const newState = endTurn(state)

        expect(newState.currentPlayer).toBe("red")
        expect(newState.consecutiveDoubles).toBe(1)

    })

    it("RULE-DOUBLES-002: triple doubles sends farthest pawn back to start", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [5, 5],
            usedDice: [5, 5],

            bonusMoves: [],
            consecutiveDoubles: 2,

            pawns: [
                { id: 0, player: "red", position: { type: "homeLane", index: 1 } },
                { id: 1, player: "red", position: { type: "track", index: 25 } }
            ]
        }

        const newState = endTurn(state)

        const pawn0 = newState.pawns.find(p => p.id === 0)!
        const pawn1 = newState.pawns.find(p => p.id === 1)!

        expect(pawn0.position).toEqual({ type: "start" })
        expect(pawn1.position).toEqual({ type: "track", index: 25 })

        expect(newState.currentPlayer).toBe("blue")
        expect(newState.consecutiveDoubles).toBe(0)

    })

})