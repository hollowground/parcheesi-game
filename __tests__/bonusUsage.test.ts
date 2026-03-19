import { describe, it, expect } from "vitest"
import { getLegalMoves } from "../engine/getLegalMoves"
import { GameState } from "../types/GameState"

describe("Bonus Usage Rules (RULE-BONUS-USAGE)", () => {

    it("RULE-BONUS-003: bonus move must be used if available", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 4],
            usedDice: [],

            bonusMoves: [20],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "red", position: { type: "track", index: 20 } },
            ]

        }

        const moves = getLegalMoves(state)

        expect(moves.length).toBeGreaterThan(0)

        // ALL moves must use the bonus (20)
        expect(moves.every(m => m.die === 20)).toBe(true)

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
                { id: 1, player: "red", position: { type: "homeLane", index: 6 } },
            ]
        }

        const moves = getLegalMoves(state)

        // Since bonus cannot be used, normal dice should be allowed
        expect(moves.some(m => m.die === 2 || m.die === 3)).toBe(true)

    })

    it("RULE-BONUS-005: bonus must be used before remaining dice", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [5, 6],
            usedDice: [5], // one die already used

            bonusMoves: [20],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 10 } },
            ]
        }

        const moves = getLegalMoves(state)

        // Only bonus moves allowed, even though die "6" is unused
        expect(moves.every(m => m.die === 20)).toBe(true)

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
