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

})