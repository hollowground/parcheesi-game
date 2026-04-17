import { describe, it, expect } from "vitest"
import { endTurn } from "../engine/endTurn"
import { GameState } from "../types/GameState"
import { playTurn } from "../engine/playTurn"

describe("Doublets Rules (RULE-DOUBLET)", () => {

    it("expands doubles into 4 dice when all pawns are out of start", () => {

        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [6, 6],
            usedDice: [],

            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                { id: 1, player: "red", position: { type: "track", index: 0 } },
                { id: 2, player: "red", position: { type: "track", index: 5 } },
                { id: 3, player: "red", position: { type: "track", index: 10 } },
                { id: 4, player: "red", position: { type: "track", index: 15 } },
            ]
        }

        const finalState = playTurn(
            state,
            () => { throw new Error("should not reach move selection") },
            { stopAfterDiceSetup: true }
        )

        expect(finalState.dice).toEqual([6, 6, 1, 1])
    })

    it("does not expand doubles if any pawn is still in start", () => { })

    it("allows all 4 dice to be used", () => { })

    it("requires all 4 parts of doublets to be playable or none are used", () => {
        const state: GameState = {
            players: ["red", "blue"],
            currentPlayer: "red",

            dice: [6, 6],
            usedDice: [],
            bonusMoves: [],
            consecutiveDoubles: 0,

            pawns: [
                // Only enough space for partial move
                { id: 1, player: "red", position: { type: "homeLane", index: 5 } },
                { id: 2, player: "red", position: { type: "homeLane", index: 5 } },
                { id: 3, player: "red", position: { type: "track", index: 10 } },
                { id: 4, player: "red", position: { type: "track", index: 20 } },
            ]
        }

        const finalState = playTurn(state, (moves) => moves[0]!)

        // ❗ nothing should move
        expect(finalState.pawns).toEqual(state.pawns)
    })

})