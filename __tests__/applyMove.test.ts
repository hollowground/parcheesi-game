import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"
import { applyMove } from "../engine/applyMove"
import type { Move } from "../types/Move"


describe("Apply Move Rules (RULE-BLOCK)", () => {

    it("RULE-MOVE-001: using a die marks it as used", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 4],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
            ]
        }

        const move: Move = {
            pawnId: 1,
            die: 3,
            from: { type: "track", index: 10 },
            to: { type: "track", index: 13 }
        }

        const newState = applyMove(state, move)

        expect(newState.usedDice).toContain(3)

    })

    it("RULE-MOVE-002: capture grants 20 bonus", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "blue", position: { type: "track", index: 13 } },
            ]
        }

        const move: Move = {
            pawnId: 1,
            die: 3,
            from: { type: "track", index: 10 },
            to: { type: "track", index: 13 },
            capture: true
        }

        const newState = applyMove(state, move)

        expect(newState.bonusMoves).toContain(20)

    })

    it("RULE-MOVE-003: reaching home grants 10 bonus", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [1],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "homeLane", index: 6 } },
            ]
        }

        const move: Move = {
            pawnId: 1,
            die: 1,
            from: { type: "homeLane", index: 6 },
            to: { type: "home" },
            finish: true
        }

        const newState = applyMove(state, move)

        expect(newState.bonusMoves).toContain(10)

    })

})