import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"
import { applyMove } from "../engine/applyMove"

describe("Bonus Usage Rules (RULE-BONUS-USAGE)", () => {

    it("RULE-BONUS-003: bonus is available AFTER dice are used", () => {

        let state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 4],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "blue", position: { type: "track", index: 13 } },
            ]
        }

        // use 3 (capture)
        let moves = getLegalMoves(state)
        state = applyMove(state, moves.find(m => m.die === 3)!)

        // use 4
        moves = getLegalMoves(state)
        state = applyMove(state, moves.find(m => m.die === 4)!)

        // NOW bonus should be available
        moves = getLegalMoves(state)

        expect(moves.some(m => m.die === 20)).toBe(true)

    })

    it("RULE-BONUS-004: bonus is lost if no pawn can use it", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [2, 3],
            usedDice: [],

            bonusMoves: [20],
            consecutiveDoubles: 0,

            // pawn is blocked (simulate via position near blockade or home overflow)
            pawns: [
                { id: 1, player: "red", position: { type: "homeLane", index: 1 } },
            ]
        }

        const moves = getLegalMoves(state)

        // Since bonus cannot be used, normal dice should be allowed
        expect(moves.some(m => m.die === 2 || m.die === 3)).toBe(true)

    })

    it("RULE-BONUS-005: bonus is NOT available until dice are used", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 4],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "blue", position: { type: "track", index: 13 } },
            ]
        }

        // STEP 1: capture with 3
        const moves = getLegalMoves(state)
        //console.log("Legal moves:", moves)
        const captureMove = moves.find(m => m.die === 3)!

        const newState = applyMove(state, captureMove)

        // STEP 2: bonus should NOT be available yet
        const newMoves = getLegalMoves(newState)

        expect(newMoves.some(m => m.die === 20)).toBe(false)
        expect(newMoves.some(m => m.die === 4)).toBe(true)

    })

    it("RULE-BONUS-006: bonus moves can chain into additional bonuses", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [20],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "blue", position: { type: "track", index: 30 } },
            ]
        }

        const moves = getLegalMoves(state)

        // At least one move should result in capture
        expect(moves.some(m => m.capture)).toBe(true)

    })

    it("RULE-BONUS-007: multiple bonuses accumulate correctly", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [10, 20],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 5 } },
            ]
        }

        const moves = getLegalMoves(state)

        const dieValues = moves.map(m => m.die)

        expect(dieValues).toContain(10)
        expect(dieValues).toContain(20)

    })
})
