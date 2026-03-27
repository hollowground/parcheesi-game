import { describe, it, expect } from "vitest"
import { playTurn } from "../engine/playTurn"
import { GameState } from "../types/GameState"

describe("PlayTurn Rules (RULE-PLAYTURN)", () => {

    it("executes a single move using available dice", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } },
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        expect(finalState.usedDice).toContain(3)

    })

    it("uses all dice when multiple are available", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 4],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } },
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        expect(finalState.usedDice).toContain(3)
        expect(finalState.usedDice).toContain(4)

    })

    it("does not use bonus until dice are finished", () => {

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

        const finalState = playTurn(state, (moves) => moves[0]!)

        // dice should be consumed before bonus
        expect(finalState.usedDice.length).toBe(2)

    })

    it("delays bonus until all dice are used", () => {

        let state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3, 4],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                // capture setup
                { id: 1, player: "red", position: { type: "track", index: 10 } },
                { id: 2, player: "blue", position: { type: "track", index: 13 } },
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        // ✅ dice must be used
        expect(finalState.usedDice).toContain(3)
        expect(finalState.usedDice).toContain(4)

        // ✅ bonus should ALSO be consumed AFTER dice
        expect(finalState.bonusMoves.length).toBe(0)

    })

    it("forfeits bonus if no pawn can move full 20 spaces", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [],
            usedDice: [],

            bonusMoves: [20],
            consecutiveDoubles: 0,

            pawns: [
                // pawn is too close to home — cannot move full 20
                { id: 1, player: "red", position: { type: "homeLane", index: 6 } },
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)
        console.log("Final state after attempting bonus:", JSON.stringify(finalState))

        // ❗ bonus must be cleared
        expect(finalState.bonusMoves.length).toBe(0)

    })

    it("allows bonus to be applied to a different pawn than the capturing pawn", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [3],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                // Pawn 1 will capture
                { id: 1, player: "red", position: { type: "track", index: 10 } },

                // Pawn 2 is elsewhere
                { id: 2, player: "red", position: { type: "track", index: 0 } },

                // Enemy to capture
                { id: 3, player: "blue", position: { type: "track", index: 13 } },
            ]
        }

        const finalState = playTurn(state, (moves) => {
            // Force capture first, then prefer moving pawn 2 for bonus
            const captureMove = moves.find(m => m.capture)
            if (captureMove) return captureMove

            return moves.find(m => m.pawnId === 2)! // force bonus on different pawn
        })

        // Pawn 2 should have moved via bonus
        const pawn2 = finalState.pawns.find(p => p.id === 2)!
        console.log(`Pawn 2 final position:`, pawn2.position)

        expect(pawn2.position.type).toBe("track")
        expect(pawn2.position).toEqual({ type: "track", index: 20 })

    })

})